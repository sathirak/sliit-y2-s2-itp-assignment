import { PaginationDto } from '../dto/pagination.dto';
import { PaginatedResponseDto } from '../dto/pagination.dto';
import { SQL, SQLWrapper, eq, and, or, like, sql } from 'drizzle-orm';

export class PaginationUtil {
  static buildWhereClause(
    search?: string,
    searchFields: string[] = [],
    additionalFilters: SQLWrapper[] = []
  ): SQLWrapper | undefined {
    const filters: SQLWrapper[] = [];

    // Add search functionality if search term and search fields are provided
    if (search && searchFields.length > 0) {
      const searchConditions = searchFields.map(field => 
        like(sql.raw(field), `%${search}%`)
      );
      filters.push(or(...searchConditions));
    }

    // Add additional filters (like deleted = false)
    filters.push(...additionalFilters);

    return filters.length > 0 ? and(...filters) : undefined;
  }

  static calculatePagination(
    page: number,
    limit: number,
    total: number
  ) {
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      page,
      limit,
      total,
      totalPages,
      hasNext,
      hasPrev,
    };
  }

  static getOffset(page: number, limit: number): number {
    return (page - 1) * limit;
  }
}
