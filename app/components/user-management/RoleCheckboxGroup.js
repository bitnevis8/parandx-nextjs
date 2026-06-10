'use client';

import { getRoleBadgeClass } from './userManagementUtils';

export default function RoleCheckboxGroup({ roles, value = [], onChange, disabled }) {
  const toggle = (roleId) => {
    if (disabled) return;
    const id = Number(roleId);
    const next = value.includes(id) ? value.filter((x) => x !== id) : [...value, id];
    onChange(next);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {roles.map((role) => {
        const checked = value.includes(role.id);
        return (
          <label
            key={role.id}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
              checked
                ? `ring-2 ring-teal-500/30 ${getRoleBadgeClass(role.name)}`
                : 'border-gray-200 bg-white text-gray-700 hover:border-teal-200'
            } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
          >
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              checked={checked}
              disabled={disabled}
              onChange={() => toggle(role.id)}
            />
            <span>{role.nameFa || role.name}</span>
          </label>
        );
      })}
    </div>
  );
}
