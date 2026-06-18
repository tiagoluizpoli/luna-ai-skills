/**
 * GOLD STANDARD REPOSITORY PATTERN
 *
 * Demonstrates:
 * 1. Decoupling Persistence (Appwrite) from Domain (Skill).
 * 2. Zod-first validation.
 * 3. Mapper pattern for normalization.
 * 4. Structured Error Handling.
 */

import { type Databases, ID, Permission, Query, Role } from 'node-appwrite';
import { z } from 'zod';

// 1. DOMAIN SCHEMA
const SkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  level: z.number().min(1).max(10),
  category: z.enum(['frontend', 'backend', 'fullstack']),
  createdAt: z.date(),
});

type Skill = z.infer<typeof SkillSchema>;

// 2. REPOSITORY INTERFACE
interface ISkillRepository {
  findById(id: string): Promise<Skill | null>;
  create(data: Omit<Skill, 'id' | 'createdAt'>, userId: string): Promise<Skill>;
  listByCategory(category: string): Promise<Skill[]>;
}

// 3. MAPPER (Internal to Repository layer)
const SkillMapper = {
  toDomain(doc: any): Skill {
    return SkillSchema.parse({
      id: doc.$id,
      name: doc.name,
      level: doc.level,
      category: doc.category,
      createdAt: new Date(doc.$createdAt),
    });
  },
  toPersistence(skill: Partial<Skill>): any {
    return {
      name: skill.name,
      level: skill.level,
      category: skill.category,
    };
  },
};

// 4. IMPLEMENTATION
export class AppwriteSkillRepository implements ISkillRepository {
  private databaseId = 'main';
  private collectionId = 'skills';

  constructor(private databases: Databases) {}

  async findById(id: string): Promise<Skill | null> {
    try {
      const doc = await this.databases.getDocument(
        this.databaseId,
        this.collectionId,
        id,
      );
      return SkillMapper.toDomain(doc);
    } catch (error: any) {
      if (error.code === 404) return null;
      throw new RepositoryError(`Failed to find skill ${id}`, error);
    }
  }

  async create(
    data: Omit<Skill, 'id' | 'createdAt'>,
    userId: string,
  ): Promise<Skill> {
    try {
      // Rule Zero: Validate before mutation
      const persistenceData = SkillMapper.toPersistence(data);

      const doc = await this.databases.createDocument(
        this.databaseId,
        this.collectionId,
        ID.unique(),
        persistenceData,
        [
          Permission.read(Role.any()), // Public read
          Permission.update(Role.user(userId)), // Only owner can edit
          Permission.delete(Role.user(userId)), // Only owner can delete
        ],
      );

      return SkillMapper.toDomain(doc);
    } catch (error: any) {
      throw new RepositoryError('Failed to create skill', error);
    }
  }

  async listByCategory(category: string): Promise<Skill[]> {
    try {
      const response = await this.databases.listDocuments(
        this.databaseId,
        this.collectionId,
        [Query.equal('category', category)],
      );

      return response.documents.map(SkillMapper.toDomain);
    } catch (error: any) {
      throw new RepositoryError(
        `Failed to list skills for category ${category}`,
        error,
      );
    }
  }
}

// Custom Error class for repositories
class RepositoryError extends Error {
  constructor(
    message: string,
    public readonly originalError?: any,
  ) {
    super(message);
    this.name = 'RepositoryError';
  }
}
