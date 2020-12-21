import { stat } from "fs";
import Loki from "lokijs";

import { rimrafAsync } from "../utils/utils";
import * as Models from "../generated/artifacts/models";
import Context from "../generated/Context";
import ISecretsMetadataStore from "./ISecretsMetadataStore";

/**
 * This is a metadata source implementation for secrets based on loki DB.
 *
 * Loki DB includes following collections and documents:
 *
 * -- SECRETS_COLLECTION     // Collection contains all secrets
 *                           // Default collection name is $SECRETS_COLLECTION$
 *                           // Each document maps to a secret
 *                           // Unique document properties: secretName
 *
 * @export
 * @class LokiSecretsMetadataStore
 */
export default class LokiSecretsMetadataStore
  implements ISecretsMetadataStore {
  private readonly db: Loki;

  private initialized: boolean = false;
  private closed: boolean = true;

  private readonly SECRETS_COLLECTION = "$SECRETS_COLLECTION$";

  public constructor(public readonly lokiDBPath: string) {
    this.db = new Loki(lokiDBPath, {
      autosave: true,
      autosaveInterval: 5000
    });
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  public isClosed(): boolean {
    return this.closed;
  }

  public async init(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      stat(this.lokiDBPath, (statError, stats) => {
        if (!statError) {
          this.db.loadDatabase({}, dbError => {
            if (dbError) {
              reject(dbError);
            } else {
              resolve();
            }
          });
        } else {
          // when DB file doesn't exist, ignore the error because following will re-create the file
          resolve();
        }
      });
    });

    // In loki DB implementation, these operations are all sync. Doesn't need an async lock

    // Create secrets collection if not exists
    let secretsColl = this.db.getCollection(this.SECRETS_COLLECTION);
    if (secretsColl === null) {
      secretsColl = this.db.addCollection(this.SECRETS_COLLECTION, {
        unique: ["secretName"],
        // Optimization for indexing and searching
        // https://rawgit.com/techfort/LokiJS/master/jsdoc/tutorial-Indexing%20and%20Query%20performance.html
        indices: ["secretName"]
      });
    }

    await new Promise<void>((resolve, reject) => {
      this.db.saveDatabase(err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    this.initialized = true;
    this.closed = false;
  }

  /**
   * Close loki DB.
   *
   * @returns {Promise<void>}
   * @memberof LokiSecretsMetadataStore
   */
  public async close(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.db.close(err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    this.closed = true;
  }

  /**
   * Clean LokiSecretsMetadataStore.
   *
   * @returns {Promise<void>}
   * @memberof LokiSecretsMetadataStore
   */
  public async clean(): Promise<void> {
    if (this.isClosed()) {
      await rimrafAsync(this.lokiDBPath);

      return;
    }
    throw new Error(`Cannot clean LokiSecretsMetadataStore, it's not closed.`);
  }

  /**
   * Set secret item in persistency layer. Will create new version if secret exists.
   *
   * @param {Context} context
   * @param {string} secretName
   * @param {Models.SecretBundle} secretBundle
   * @returns {Promise<Models.SecretBundle>}
   * @memberof LokiSecretsMetadataStore
   */
  public async setSecret(context: Context, secretName: string, secretBundle: Models.SecretBundle): Promise<Models.SecretBundle> {
    const coll = this.db.getCollection(this.SECRETS_COLLECTION);
    const secretDoc = coll.findOne({
      secretName
    });

    // validateParameters(context, parameters, secretDoc);

    if (secretDoc) {
      let secretVersions = secretDoc.versions;
      secretVersions.push(secretBundle);
    }
    return coll.update(secretDoc);
  }

  deleteSecret(context: Context, secretName: string): Promise<Models.DeleteSecretResponse> {
    throw new Error("Method not implemented.");
  }
  updateSecret(context: Context, secretName: string, secretVersion: string, parameters: Models.VoltServerSecretsUpdateSecretOptionalParams): Promise<Models.UpdateSecretResponse> {
    throw new Error("Method not implemented.");
  }
  getSecret(context: Context, secretName: string, secretVersion: string): Promise<Models.GetSecretResponse> {
    throw new Error("Method not implemented.");
  }
  getSecrets(context: Context, parameters: Models.VoltServerSecretsGetSecretsOptionalParams): Promise<Models.GetSecretsResponse> {
    throw new Error("Method not implemented.");
  }
  getSecretVersions(context: Context, secretName: string, parameters: Models.VoltServerSecretsGetSecretVersionsOptionalParams): Promise<Models.GetSecretVersionsResponse> {
    throw new Error("Method not implemented.");
  }
}