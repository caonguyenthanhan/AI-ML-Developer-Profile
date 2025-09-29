import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      uploadDir: './public/image/genai',
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
    });

    const [fields, files] = await form.parse(req);
    
    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const prompt = Array.isArray(fields.prompt) ? fields.prompt[0] : fields.prompt;
    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

    if (!title || !prompt || !imageFile) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Đọc file HTML hiện tại
    const htmlFilePath = path.join(process.cwd(), 'public', 'image_prompt_library.html');
    let htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

    // Tìm vị trí của promptsData array
    const promptsDataStart = htmlContent.indexOf('const promptsData = [');
    const promptsDataEnd = htmlContent.indexOf('];', promptsDataStart) + 2;
    
    if (promptsDataStart === -1 || promptsDataEnd === -1) {
      return res.status(500).json({ error: 'Could not find promptsData in HTML file' });
    }

    // Extract current promptsData
    const promptsDataSection = htmlContent.substring(promptsDataStart, promptsDataEnd);
    const promptsDataMatch = promptsDataSection.match(/const promptsData = (\[[\s\S]*?\]);/);
    
    if (!promptsDataMatch) {
      return res.status(500).json({ error: 'Could not parse promptsData' });
    }

    let promptsData;
    try {
      // Safely evaluate the array
      promptsData = eval(promptsDataMatch[1]);
    } catch (error) {
      return res.status(500).json({ error: 'Could not parse existing prompts data' });
    }

    // Tạo tên file ảnh mới
    const fileExtension = path.extname(imageFile.originalFilename || imageFile.newFilename);
    const newImageName = `image${promptsData.length + 1}${fileExtension}`;
    const newImagePath = path.join('./public/image/genai', newImageName);

    // Di chuyển file ảnh
    fs.renameSync(imageFile.filepath, newImagePath);

    // Tạo prompt object mới
    const newPrompt = {
      id: promptsData.length + 1,
      title: title,
      prompt: prompt,
      imagePath: `image/genai/${newImageName}`
    };

    // Thêm prompt mới vào array
    promptsData.push(newPrompt);

    // Tạo nội dung promptsData mới
    const newPromptsDataString = `const promptsData = ${JSON.stringify(promptsData, null, 12)};`;

    // Thay thế trong HTML content
    const newHtmlContent = htmlContent.substring(0, promptsDataStart) + 
                          newPromptsDataString + 
                          htmlContent.substring(promptsDataEnd);

    // Ghi lại file HTML
    fs.writeFileSync(htmlFilePath, newHtmlContent, 'utf8');

    // Cập nhật số lượng prompts trong HTML
    const updatedHtmlContent = newHtmlContent.replace(
      /document\.getElementById\('prompt-count'\)\.textContent = promptsData\.length;/,
      `document.getElementById('prompt-count').textContent = ${promptsData.length};`
    );

    fs.writeFileSync(htmlFilePath, updatedHtmlContent, 'utf8');

    res.status(200).json({ 
      success: true, 
      message: 'Prompt added successfully',
      newPrompt: newPrompt,
      totalPrompts: promptsData.length
    });

  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
}