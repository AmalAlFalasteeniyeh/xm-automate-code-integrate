import logger from '../utils/logger.js';

/**
 * CodeGen Adapter
 * Manages code generation integration
 */
class CodeGenAdapter {
  constructor(config) {
    this.config = config;
    this.apiKey = process.env.CODEGEN_API_KEY;
    this.baseUrl = process.env.CODEGEN_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`CodeGen API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  /**
   * Generate code from specification
   */
  async generateCode({ specification, language, template = null, options = {} }) {
    try {
      const result = await this.request('/generate', {
        method: 'POST',
        body: JSON.stringify({
          specification,
          language,
          template,
          options
        })
      });

      logger.info({ language, template }, 'Code generated');
      return result;
    } catch (error) {
      logger.error({ error, language }, 'Failed to generate code');
      throw error;
    }
  }

  /**
   * Validate generated code
   */
  async validateCode({ code, language, rules = [] }) {
    try {
      const result = await this.request('/validate', {
        method: 'POST',
        body: JSON.stringify({
          code,
          language,
          rules
        })
      });

      logger.info({ language, valid: result.valid }, 'Code validated');
      return result;
    } catch (error) {
      logger.error({ error, language }, 'Failed to validate code');
      throw error;
    }
  }

  /**
   * Apply code transformations
   */
  async transformCode({ code, language, transformations = [] }) {
    try {
      const result = await this.request('/transform', {
        method: 'POST',
        body: JSON.stringify({
          code,
          language,
          transformations
        })
      });

      logger.info({ language, transformations: transformations.length }, 'Code transformed');
      return result;
    } catch (error) {
      logger.error({ error, language }, 'Failed to transform code');
      throw error;
    }
  }

  /**
   * Get available templates
   */
  async getTemplates(language = null) {
    try {
      const query = language ? `?language=${language}` : '';
      return await this.request(`/templates${query}`);
    } catch (error) {
      logger.error({ error, language }, 'Failed to get templates');
      throw error;
    }
  }

  /**
   * Create custom template
   */
  async createTemplate({ name, language, template, metadata = {} }) {
    try {
      const result = await this.request('/templates', {
        method: 'POST',
        body: JSON.stringify({
          name,
          language,
          template,
          metadata
        })
      });

      logger.info({ name, language }, 'Template created');
      return result;
    } catch (error) {
      logger.error({ error, name }, 'Failed to create template');
      throw error;
    }
  }
}

export default CodeGenAdapter;
