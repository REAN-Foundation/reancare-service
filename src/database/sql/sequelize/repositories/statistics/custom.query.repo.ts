import { Dialect, Op } from 'sequelize';
import fs from 'fs';
import { createObjectCsvWriter } from 'csv-writer';
import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import { TimeHelper } from '../../../../../common/time.helper';
import { DateStringFormat,  } from '../../../../../domain.types/miscellaneous/time.types';
import { Sequelize } from 'sequelize-typescript';
import { CustomQueryDomainModel } from '../../../../../domain.types/statistics/custom.query/custom.query.domain.model';
import path from 'path';
import { ConfigurationManager } from '../../../../../config/configuration.manager';
import StatisticsCustomQueries from '../../models/statistics/custom.query.model';
import { ICustomQueryRepo } from '../../../../../database/repository.interfaces/statistics/custom.query.repo.interface';
import { uuid } from '../../../../../domain.types/miscellaneous/system.types';
import { CustomQueryDto } from '../../../../../domain.types/statistics/custom.query/custom.query.dto';
import { CustomQuerySearchResults } from '../../../../../domain.types/statistics/custom.query/custom.query.search.type';
import { CustomQuerySearchFilters } from '../../../../../domain.types/statistics/custom.query/custom.query.search.type';
import { CustomQueryMapper } from '../../mappers/statistics/custom.query.mapper';
 
////////////////////////////////////////////////////////////////////////////////////////////

const sequelizeStats = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER_NAME,
    process.env.DB_USER_PASSWORD, {
        host    : process.env.DB_HOST,
        dialect : process.env.DB_DIALECT  as Dialect,
    });
    
//////////////////////////////////////////////////////////////////////////////////////////////

export class CustomQueryRepo implements ICustomQueryRepo {

  executeQuery = async (createModel: CustomQueryDomainModel): Promise<any> => {
      try {

          var tags = createModel.Tags && createModel.Tags.length > 0 ?
              JSON.stringify(createModel.Tags) : '[]';

          const entity = {
              Name        : createModel.Name,
              Query       : createModel.Query,
              Tags        : tags,
              Description : createModel.Description,
              UserId      : createModel.UserId,
              TenantId    : createModel.TenantId,
          };

          const hasDisallowedKeyword = containsDisallowedKeyword(entity.Query);

          if (hasDisallowedKeyword) {
              throw new ApiError(404, 'Only read only queries are allowed' );
          }

          const [results] = await sequelizeStats.query(entity.Query);

          const customQuery = await StatisticsCustomQueries.create(entity);
    
          if (createModel.Format === 'JSON'){
              const generatedFilePath = await getGeneratedFilePath('.json' );
              const jsonContent = JSON.stringify(results, null, 2);
              fs.writeFileSync(generatedFilePath, jsonContent);
              return generatedFilePath;
          }

          if (createModel.Format === 'CSV') {
              const generatedFilePath = await getGeneratedFilePath('.csv' );
              const csvWriter = createObjectCsvWriter({
                  path   : generatedFilePath,
                  header : Object.keys(results[0]).map(key => ({ id: key, title: key })),
              });
              await csvWriter.writeRecords(results);
              return generatedFilePath;
          }

          return results;

      } catch (error) {
          Logger.instance().log(error.message);
          throw new ApiError(404, error.message);
      }
  };

   search = async (filters: CustomQuerySearchFilters): Promise<CustomQuerySearchResults> => {
       try {
           const search = { where: {} };
           if (filters.Name != null) {
               search.where['Name'] = { [Op.like]: '%' + filters.Name + '%' };
           }
           if (filters.UserId != null) {
               search.where['UserId'] = filters.UserId;
           }
           if (filters.TenantId != null) {
               search.where['TenantId'] = filters.TenantId;
           }

           if (filters.Tags !== null) {
               search.where['Tags'] = { [Op.like]: '%' + filters.Tags + '%' };
           }

           let orderByColum = 'CreatedAt';
           if (filters.OrderBy) {
               orderByColum = filters.OrderBy;
           }
           let order = 'ASC';
           if (filters.Order === 'descending') {
               order = 'DESC';
           }
           search['order'] = [[orderByColum, order]];

           let limit = 25;
           if (filters.ItemsPerPage) {
               limit = filters.ItemsPerPage;
           }
           let offset = 0;
           let pageIndex = 0;
           if (filters.PageIndex) {
               pageIndex = filters.PageIndex < 0 ? 0 : filters.PageIndex;
               offset = pageIndex * limit;
           }
           search['limit'] = limit;
           search['offset'] = offset;

           const foundResults = await StatisticsCustomQueries.findAndCountAll(search);
           const dtos = foundResults.rows.map((cohort) => CustomQueryMapper.toDto(cohort));
           const searchResults: CustomQuerySearchResults = {
               TotalCount     : foundResults.count,
               RetrievedCount : dtos.length,
               PageIndex      : pageIndex,
               ItemsPerPage   : limit,
               Order          : order === 'DESC' ? 'descending' : 'ascending',
               OrderedBy      : orderByColum,
               Items          : dtos,
           };
           return searchResults;
       } catch (error) {
           throw new Error(`Failed to retrieve queries: ${error.message}`);
       }
   };

   getById = async (id: uuid): Promise<CustomQueryDto> => {
       try {
           const cohort = await StatisticsCustomQueries.findByPk(id);
           if (cohort == null) {
               return null;
           }
           return CustomQueryMapper.toDto(cohort);
       } catch (error) {
           throw new Error(`Failed to retrieve query by Id: ${error.message}`);
       }
   };

   update = async (id: string, updateModel: CustomQueryDomainModel):
   Promise<any> => {
       try {
           const query = await StatisticsCustomQueries.findByPk(id);

           if (updateModel.Name != null) {
               query.Name = updateModel.Name;
           }
           if (updateModel.Description != null) {
               query.Description = updateModel.Description;
           }
           if (updateModel.Query != null) {
               query.Query = updateModel.Query;
           }
           if (updateModel.Tags != null) {
               var tags = JSON.stringify(updateModel.Tags);
               query.Tags = tags;
           }
           if (updateModel.TenantId != null) {
               query.TenantId = updateModel.TenantId;
           }
           if (updateModel.UserId != null) {
               query.UserId = updateModel.UserId;
           }
         
           await query.save();

           const hasDisallowedKeyword = containsDisallowedKeyword(updateModel.Query);

           if (hasDisallowedKeyword) {
               throw new ApiError(404, 'Only read only queries are allowed' );
           }
 
           const [results] = await sequelizeStats.query(updateModel.Query);
     
           if (updateModel.Format === 'JSON'){
               const generatedFilePath = await getGeneratedFilePath('.json' );
               const jsonContent = JSON.stringify(results, null, 2);
               fs.writeFileSync(generatedFilePath, jsonContent);
               return generatedFilePath;
           }
 
           if (updateModel.Format === 'CSV') {
               const generatedFilePath = await getGeneratedFilePath('.csv' );
               const csvWriter = createObjectCsvWriter({
                   path   : generatedFilePath,
                   header : Object.keys(results[0]).map(key => ({ id: key, title: key })),
               });
               await csvWriter.writeRecords(results);
               return generatedFilePath;
           }
 
           return results;

       } catch (error) {
           Logger.instance().log(error.message);
           throw new ApiError(500, error.message);
       }
   };

 delete = async (id: uuid): Promise<boolean> => {
     try {
         const query = await StatisticsCustomQueries.findByPk(id);
         if (query == null) {
             return false;
         }
         const result = await StatisticsCustomQueries.destroy( {
             where : {
                 id : query.id,
             }
         });
         return result === 1;
     } catch (error) {
         throw new Error(`Failed to delete query: ${error.message}`);
     }
 };

}

function containsDisallowedKeyword(query: string ): boolean {
    const disallowedKeywords = [
        'CREATE', 'ALTER', 'DROP', 'TRUNCATE',
        'RENAME', 'INSERT', 'UPDATE', 'DELETE',
        'MERGE', 'GRANT', 'REVOKE', 'COMMIT',
        'ROLLBACK', 'SAVEPOINT', 'SET', 'UPSERT'
    ];

    const queryKeywords = query.split(" ");

    for (const keyword of queryKeywords) {
        const normalizedWord = keyword.trim().toUpperCase();
        if (disallowedKeywords.includes(normalizedWord)) {
            return true;
        }
    }
    return false;
}

async function getGeneratedFilePath( extension: string): Promise<string> {
    const uploadFolder = ConfigurationManager.UploadTemporaryFolder();
    var dateFolder = TimeHelper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
    var fileFolder = path.join(uploadFolder, dateFolder);
    await fs.promises.mkdir(fileFolder, { recursive: true });
    const timestamp = TimeHelper.timestamp(new Date());
    const filename = timestamp + extension;
    const absFilepath = path.join(fileFolder, filename);
    return absFilepath;
}
