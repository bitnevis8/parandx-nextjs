"use client";

import { useCallback, useMemo } from "react";
import { useAuth } from "../context/AuthContext";

const EXPERT_ROLES = ["admin", "moderator", "expert"];
const MERCHANT_ROLES = ["admin", "moderator", "merchant"];
const ADMIN_ROLES = ["admin", "moderator"];
const CUSTOMER_ROLES = ["admin", "moderator", "expert", "merchant", "customer"];
const ROLE_PRIORITY = ["admin", "moderator", "expert", "merchant", "customer", "guest"];

export function useRole() {
  const { user } = useAuth();

  const roleNames = useMemo(() => {
    if (!user?.userRoles?.length) return [];
    return user.userRoles.map((role) => role.name);
  }, [user?.userRoles]);

  const hasRole = useCallback(
    (roleName) => roleNames.includes(roleName),
    [roleNames]
  );

  const hasAnyRole = useCallback(
    (names) => names.some((name) => roleNames.includes(name)),
    [roleNames]
  );

  const isAdmin = useCallback(() => hasRole("admin"), [hasRole]);
  const isModerator = useCallback(() => hasRole("moderator"), [hasRole]);
  const isExpert = useCallback(() => hasRole("expert"), [hasRole]);
  const isMerchant = useCallback(() => hasRole("merchant"), [hasRole]);
  const isCustomer = useCallback(() => hasRole("customer"), [hasRole]);
  const isGuest = useCallback(() => hasRole("guest"), [hasRole]);

  const canAccessAdmin = useCallback(
    () => hasAnyRole(ADMIN_ROLES),
    [hasAnyRole]
  );
  const canAccessExpert = useCallback(
    () => hasAnyRole(EXPERT_ROLES),
    [hasAnyRole]
  );
  const canAccessMerchant = useCallback(
    () => hasAnyRole(MERCHANT_ROLES),
    [hasAnyRole]
  );
  const canAccessCustomer = useCallback(
    () => hasAnyRole(CUSTOMER_ROLES),
    [hasAnyRole]
  );

  const getUserRoles = useCallback(() => [...roleNames], [roleNames]);

  const getPrimaryRole = useCallback(() => {
    for (const role of ROLE_PRIORITY) {
      if (roleNames.includes(role)) return role;
    }
    return "guest";
  }, [roleNames]);

  return {
    user,
    hasRole,
    hasAnyRole,
    isAdmin,
    isModerator,
    isExpert,
    isMerchant,
    isCustomer,
    isGuest,
    canAccessAdmin,
    canAccessExpert,
    canAccessMerchant,
    canAccessCustomer,
    getUserRoles,
    getPrimaryRole,
  };
}
