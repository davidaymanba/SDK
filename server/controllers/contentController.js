import { getContent, updateSection } from "../services/contentService.js";

export async function readContent(request, response, next) {
  try {
    response.json(await getContent());
  } catch (error) {
    next(error);
  }
}

export async function writeSection(request, response, next) {
  try {
    response.json(await updateSection(request.params.section, request.body));
  } catch (error) {
    next(error);
  }
}
