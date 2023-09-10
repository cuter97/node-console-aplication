import fs from 'fs';
import { SaveFile } from './save-file.use-case';

describe('SaveFileUseCase', () => {

    const customOptions = {
        fileContent: 'custom content',
        destination: 'custom-outputs/file-destination',
        fileName: 'custom-table-name'
    }

    const customFilePath = `${customOptions.destination}/${customOptions.fileName}.txt`

    beforeEach(() => {
        //clean up
        const exist = fs.existsSync('outputs');
        if (exist) fs.rmSync('outputs', { recursive: true });

        const outputExist = fs.existsSync('outputs');
        if (outputExist) fs.rmSync(customOptions.destination, { recursive: true });
    });

    test('should save file with default values', () => {

        const saveFile = new SaveFile();
        const filePath = 'outputs/table.txt'

        const options = {
            fileContent: 'test content'
        }

        const result = saveFile.execute(options);
        const checkFile = fs.existsSync(filePath);
        const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });

        expect(result).toBeTruthy();
        expect(checkFile).toBeTruthy();
        expect(fileContent).toBe(options.fileContent);

    });

    test('should save file with custom values', () => {

        const saveFile = new SaveFile();
        const result = saveFile.execute(customOptions);
        const checkFile = fs.existsSync(customFilePath);
        const fileContent = fs.readFileSync(customFilePath, { encoding: 'utf-8' });

        expect(result).toBeTruthy();
        expect(checkFile).toBeTruthy();
        expect(fileContent).toBe(customOptions.fileContent);

    });

    test('should return false if directory could not be created', () => {

        const saveFile = new SaveFile();
        const mkdirSpy = jest.spyOn(fs, 'mkdirSync').mockImplementation(
            () => { throw new Error('This is a custom error message from testing'); }
        );

        const result = saveFile.execute(customOptions);

        expect(result).toBe(false);

        mkdirSpy.mockRestore();

    });

    test('should return false if file could not be created', () => {

        const saveFile = new SaveFile();
        const writeFileSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(
            () => { throw new Error('This is a custom error message from testing'); }
        );

        const result = saveFile.execute({ fileContent: 'Test' });

        expect(result).toBe(false);
        
        writeFileSpy.mockRestore();

    });

});