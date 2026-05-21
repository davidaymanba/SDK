export function uploadImage(request, response) {
  if (!request.file) return response.status(400).json({ message: "No file uploaded" });
  response.status(201).json({
    url: `/uploads/${request.file.filename}`,
    filename: request.file.filename,
    originalName: request.file.originalname,
  });
}
