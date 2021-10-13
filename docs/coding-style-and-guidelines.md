# Coding Style And Guidelines

For general TypeScript coding style guidelines, you can refer [Google's TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html).

In addition to these, here are naming conventions we follow for this project.

1. All statements should end with semicolons. This is a must! e.g. `_authorizer: Authorizer = null;`. Statements without semicolons are discouraged.
2. It is recommended that you always specify the Typescript type for variable declaration and passing the arguments. e.g. `async (request: express.Request, response: express.Response)`
3. Use comments sparingly. Add comments only when absolutely needed. 
4. Do not add comments for method signatures. Method signature nomenclature (method-name and argument-names) should be clear enough. Don't mention the obvious.
5. All folders be named in lower-case letters. If there are multiple words in folder name, separate those words by dot ('.'). For example, 'input.validators'.
6. All code files (i.e. Typescript files with '.ts' extension, JSON files with .json extension, etc.) be named in lower-case letters. If there are multiple words in the file name, separate those words by dor ('.'). For example, `api.client.controller.ts`.
7. Please follow this naming convention for various file types.
   - Controllers - `*.controller.ts`
   - Input validators/sanitizers - `*.input.validator.ts`
   - Routes - `*.routes.ts`
   - Interfaces - `*.interface.ts`
   - Repository interfaces - `*.repo.interface.ts`
   - Services - `*.service.ts`
   - Domain Types - `*.domain.types.ts`
   - Repositories - `*.repo.ts`
   - Models - `*.model.ts`
   - FHIR JSON schema - `*.fhir.json`
8. All class names, interface names, type names, enum names should follow PascalCase, which is camelCase with capitalized first letter. e.g. `export class PatientController {`.
9. Interfaces which are only used for enforcing the method signature contracts should start with 'I'. For example, `IPatientRepo`.
10. All variable names should follow camelCase. e.g. `var myVariable = 'xyz'`.
11. All class member variables should be camelCase prefixed by underscore ('_'). e.g. `_myClassVariable`
12. All method/function names should follow camelCase. e.g. `getByUserId = async (request: express.Request, response: express.Response)`.
13. All method/function argument names should follow camelCase.
14. All database model/table column-names should follow pascal case except primary key parameter, which is `'id'`. e.g. `'PersonRole'`
15. All database table/document collection names should be lowercase with every word separated by underscore ('_'). The name of the tables should indicate plural version. e.g. `'person_roles',`
16. For code files, file content demarcation is only allowed between imports area and code area. 
    e.g. 
```javascript
import { AddressDomainModel } from '../../domain.types/address.domain.types';
import { AddressInputValidator } from '../input.validators/address.input.validator';
import { AddressService } from '../../services/address.service';
import { RoleService } from '../../services/role.service';

//////////////////////////////////////////////////////////////////////////////

export class PatientController {

    //#region member variables and constructors

    _service: PatientService = null;
    _userService: UserService = null;
    _personService: PersonService = null;
```

12. You can use regions (`//#region and //#endregion`) if you feel it necessary to club together related type of the code and collapse it whenever needed. It is not recommended to overdo it.
13. For controller action methods, please use `try-catch` block across the function content and handle exceptions through `ResponseHandler` class.
14. Use of `async-await` is preferred over `promises` and use of `promises` is preferred over callbacks and `.then` constructs. Multiple cascading loops of `.then` constructs is simply no-no.
