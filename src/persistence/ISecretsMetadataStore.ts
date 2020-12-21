import ICleaner from "../ICleaner";
import IDataStore from "../IDataStore";
import * as Models from "../generated/artifacts/models";
import Context from "../generated/Context";

/**
 * Persistency layer metadata storage interface.
 *
 *
 * @export
 * @interface ISecretsMetadataStore
 * @extends {IDataStore}
 */
export interface ISecretsMetadataStore
  extends IDataStore,
    ICleaner {

  /**
   * Set secret.
   *
   * @param {Context} context
   * @param {string} secretName
   * @param {Models.SecretSetParameters} parameters
   * @returns {Promise<Models.SetSecretResponse>}
   * @memberof ISecretsMetadataStore
   */
  setSecret(
    context: Context,
    secretName: string,
    parameters: Models.SecretSetParameters
  ): Promise<Models.SetSecretResponse>;

  /**
   * Delete secret.
   *
   * @param {Context} context
   * @param {string} secretName
   * @returns {Promise<Models.DeleteSecretResponse>}
   * @memberof ISecretsMetadataStore
   */
  deleteSecret(
    context: Context,
    secretName: string
  ): Promise<Models.DeleteSecretResponse>;
  
  /**
   * Update secret.
   *
   * @param {Context} context
   * @param {string} secretName
   * @param {string} secretVersion
   * @param {Models.KeyVaultClientUpdateSecretOptionalParams} parameters
   * @returns {Promise<Models.UpdateSecretResponse>}
   * @memberof ISecretsMetadataStore
   */
  updateSecret(
    context: Context,
    secretName: string,
    secretVersion: string,
    parameters: Models.KeyVaultClientUpdateSecretOptionalParams
  ): Promise<Models.UpdateSecretResponse>;

  /**
   * Get secret.
   *
   * @param {Context} context
   * @param {string} secretName
   * @param {string} secretVersion
   * @returns {Promise<Models.GetSecretResponse>}
   * @memberof ISecretsMetadataStore
   */
  getSecret(
    context: Context,
    secretName: string,
    secretVersion: string
  ): Promise<Models.GetSecretResponse>;

  /**
   * Get secrets.
   *
   * @param {Context} context
   * @param {Models.KeyVaultClientGetSecretsOptionalParams} parameters
   * @returns {Promise<Models.GetSecretsResponse>}
   * @memberof ISecretsMetadataStore
   */
  getSecrets(
    context: Context,
    parameters: Models.KeyVaultClientGetSecretsOptionalParams
  ): Promise<Models.GetSecretsResponse>;  
  
  /**
   * Get secret versions.
   *
   * @param {Context} context
   * @param {string} secretName
   * @returns {Promise<Models.GetSecretVersionsResponse>}
   * @memberof ISecretsMetadataStore
   */
  getSecretVersions(
    context: Context,
    secretName: string,
    parameters: Models.KeyVaultClientGetSecretVersionsOptionalParams
  ): Promise<Models.GetSecretVersionsResponse>;
  
  // TODO: implement the following methods
  // /**
  //  * Get seleted secrets.
  //  *
  //  * @param {Context} context
  //  * @returns {Promise<void>}
  //  * @memberof ISecretsMetadataStore
  //  */
  // getDeletedSecrets(
  //   context: Context,
  // ): Promise<void>;
  
  // /**
  //  * Get deleted secret.
  //  *
  //  * @param {Context} context
  //  * @returns {Promise<void>}
  //  * @memberof ISecretsMetadataStore
  //  */
  // getDeletedSecret(
  //   context: Context,
  // ): Promise<void>;
  
  // /**
  //  * Recover deleted secret.
  //  *
  //  * @param {Context} context
  //  * @returns {Promise<void>}
  //  * @memberof ISecretsMetadataStore
  //  */
  // recoverDeletedSecret(
  //   context: Context,
  // ): Promise<void>;
  
  // /**
  //  * Backup secret.
  //  *
  //  * @param {Context} context
  //  * @returns {Promise<void>}
  //  * @memberof ISecretsMetadataStore
  //  */
  // backupSecret(
  //   context: Context,
  // ): Promise<void>;
  
  // /**
  //  * Restore secret.
  //  *
  //  * @param {Context} context
  //  * @returns {Promise<void>}
  //  * @memberof ISecretsMetadataStore
  //  */
  // restoreSecret(
  //   context: Context,
  // ): Promise<void>;
}

export default ISecretsMetadataStore;