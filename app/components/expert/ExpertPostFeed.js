'use client';

import { useCallback, useEffect, useState } from 'react';
import { GlobeAltIcon, LockClosedIcon, TrashIcon } from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '../../config/api';
import ExpertPostComposer from './ExpertPostComposer';

function formatPostDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

function PostCard({ post, isOwner, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('این پست حذف شود؟')) return;
    setDeleting(true);
    try {
      const res = await fetch(API_ENDPOINTS.experts.deletePost(post.id), {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json();
      if (res.ok && json.success) onDelete?.(post.id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <article className="border-b border-slate-100 px-4 py-4 last:border-b-0 sm:px-5">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <time dateTime={post.createdAt}>{formatPostDate(post.createdAt)}</time>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${
              post.visibility === 'followers'
                ? 'bg-amber-50 text-amber-800 ring-1 ring-amber-100'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {post.visibility === 'followers' ? (
              <>
                <LockClosedIcon className="h-3.5 w-3.5" aria-hidden />
                دنبال‌کنندگان
              </>
            ) : (
              <>
                <GlobeAltIcon className="h-3.5 w-3.5" aria-hidden />
                عمومی
              </>
            )}
          </span>
        </div>
        {isOwner ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            <TrashIcon className="h-4 w-4" aria-hidden />
            حذف
          </button>
        ) : null}
      </div>
      <p className="whitespace-pre-wrap text-sm leading-7 text-slate-800">{post.content}</p>
    </article>
  );
}

export default function ExpertPostFeed({ expertId }) {
  const [posts, setPosts] = useState([]);
  const [meta, setMeta] = useState({ isOwner: false, following: false });
  const [loading, setLoading] = useState(true);
  const [hint, setHint] = useState('');

  const load = useCallback(() => {
    if (!expertId) return undefined;
    setLoading(true);
    let cancelled = false;

    fetch(API_ENDPOINTS.experts.posts(expertId), { credentials: 'include' })
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        if (res.success) {
          setPosts(res.data || []);
          setMeta(res.meta || {});
          if (!res.data?.length && !res.meta?.isOwner) {
            setHint(
              res.meta?.following
                ? 'هنوز پستی منتشر نشده است.'
                : 'برای دیدن پست‌های ویژهٔ دنبال‌کننده‌ها، اول دنبالش کنید.'
            );
          } else {
            setHint('');
          }
        }
      })
      .catch(() => setHint('بارگذاری پست‌ها ممکن نشد.'))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [expertId]);

  useEffect(() => load(), [load]);

  useEffect(() => {
    const onFollowChange = (e) => {
      if (Number(e.detail?.expertId) === Number(expertId)) load();
    };
    window.addEventListener('expert-follow-changed', onFollowChange);
    window.addEventListener('expert-trust-changed', onFollowChange);
    return () => {
      window.removeEventListener('expert-follow-changed', onFollowChange);
      window.removeEventListener('expert-trust-changed', onFollowChange);
    };
  }, [expertId, load]);

  const onPosted = (newPost) => {
    if (newPost?.id) {
      setPosts((prev) => [newPost, ...prev]);
      setHint('');
    } else {
      load();
    }
  };

  const onDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  return (
    <div>
      {meta.isOwner ? <ExpertPostComposer onPosted={onPosted} /> : null}

      {loading ? (
        <div className="space-y-3 p-4 sm:p-5">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} isOwner={meta.isOwner} onDelete={onDelete} />
          ))}
        </div>
      ) : (
        <p className="px-4 py-10 text-center text-sm text-slate-500 sm:px-5">
          {hint || 'هنوز پستی منتشر نشده است.'}
        </p>
      )}
    </div>
  );
}
