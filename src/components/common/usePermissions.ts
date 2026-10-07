/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * What the signed in person may do (see permissionsFor in services/auth/access.ts),
 * kept up to date when they sign in or out. Screens use it to hide what the rules refuse.
 */

import { useEffect, useState } from 'react';
import { authService } from '../../services/auth/authService';
import { permissionsFor, type Permissions } from '../../services/auth/access';

export function usePermissions(): Permissions {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  useEffect(() => authService.subscribe(setUser), []);
  return permissionsFor(user);
}
