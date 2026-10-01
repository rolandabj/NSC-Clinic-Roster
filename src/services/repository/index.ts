/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Repository Provider
 * Cloud Firestore is the only data store. The connection comes from the
 * firebase-applet-config.json file provisioned by Google AI Studio.
 */

import { IRepository } from './IRepository';
import { FirestoreRepository } from './FirestoreRepository';
import { defaultFirebaseConfig } from '../firebase/firebaseConfig';

export { FirestoreRepository } from './FirestoreRepository';

export type StorageMode = 'FIRESTORE';

class RepositoryManager {
  private activeRepo: IRepository;

  constructor() {
    this.activeRepo = new FirestoreRepository(defaultFirebaseConfig);
  }

  public getRepo(): IRepository {
    return this.activeRepo;
  }

  public getMode(): StorageMode {
    return 'FIRESTORE';
  }

  public getIsCloudMode(): boolean {
    return true;
  }
}

export const repositoryManager = new RepositoryManager();
export const getRepository = (): IRepository => repositoryManager.getRepo();
