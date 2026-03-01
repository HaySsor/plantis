import { createHash } from "crypto";
import { requireUser } from "../utils/requireUser";

export default defineEventHandler(async (event) => {
  await requireUser(event);

  const formData = await readMultipartFormData(event);
  if (!formData?.length) {
    throw createError({ statusCode: 400, statusMessage: "Brak pliku" });
  }

  const file = formData.find((f) => f.name === "file");
  if (!file || !file.data) {
    throw createError({ statusCode: 400, statusMessage: "Brak pliku" });
  }

  const mimeType = file.type ?? "image/jpeg";
  if (!mimeType.startsWith("image/")) {
    throw createError({ statusCode: 400, statusMessage: "Dozwolone są tylko obrazy" });
  }

  if (file.data.length > 10 * 1024 * 1024) {
    throw createError({ statusCode: 400, statusMessage: "Plik nie może przekraczać 10 MB" });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw createError({ statusCode: 500, statusMessage: "Brak konfiguracji Cloudinary" });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const eager = "c_limit,w_800,h_1067,q_auto:good,f_auto";
  const folder = "plantis";

  // Podpis: parametry posortowane alfabetycznie + api_secret
  const signString = `eager=${eager}&folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = createHash("sha1").update(signString).digest("hex");

  const uploadForm = new FormData();
  uploadForm.append("file", new Blob([file.data], { type: mimeType }), file.filename ?? "upload.jpg");
  uploadForm.append("api_key", apiKey);
  uploadForm.append("timestamp", String(timestamp));
  uploadForm.append("signature", signature);
  uploadForm.append("folder", folder);
  uploadForm.append("eager", eager);

  const result = await $fetch<{ secure_url: string; eager?: { secure_url: string }[] }>(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: uploadForm }
  );

  const url = result.eager?.[0]?.secure_url ?? result.secure_url;
  return { url };
});
