'use client';

import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';

export function useProfileTarget(targetUserId) {
  const { user: authUser } = useAuth();

  const parsedTargetId = targetUserId ? String(targetUserId) : null;
  const selfId = authUser?.id != null ? String(authUser.id) : null;

  const isManagingOther = Boolean(
    parsedTargetId && selfId && parsedTargetId !== selfId
  );

  const canManageOther = useMemo(() => {
    if (!authUser?.userRoles?.length) return false;
    return authUser.userRoles.some((r) => r.name === 'admin' || r.name === 'moderator');
  }, [authUser?.userRoles]);

  const profileFetchUrl = useMemo(() => {
    if (isManagingOther && canManageOther) {
      return API_ENDPOINTS.users.profileById(parsedTargetId);
    }
    return API_ENDPOINTS.users.getCurrentProfile;
  }, [isManagingOther, canManageOther, parsedTargetId]);

  const profileSaveUrl = useMemo(() => {
    if (isManagingOther && canManageOther) {
      return API_ENDPOINTS.users.updateProfileById(parsedTargetId);
    }
    return API_ENDPOINTS.users.updateCurrentProfile;
  }, [isManagingOther, canManageOther, parsedTargetId]);

  return {
    targetUserId: parsedTargetId,
    isManagingOther,
    canManageOther,
    profileFetchUrl,
    profileSaveUrl,
  };
}
