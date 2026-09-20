import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, projectId, sanityPruefen, studioUrl } from "./env";

/**
 * Lese-Client für veröffentlichte Inhalte (CDN, gecacht).
 * Für die Entwurfsvorschau liefert `vorschauClient()` einen Client mit Token,
 * Perspektive «drafts» und Stega-Kodierung (Visual Editing).
 *
 * Wird lazy gebaut (erst beim ersten Aufruf von `client()`), nicht beim Import
 * des Moduls: `createClient` wirft sofort, wenn `projectId` leer ist. Ohne diese
 * Verzögerung würde schon das blosse Importieren dieser Datei – z. B. durch die
 * Vorschau-/Revalidate-Routen, die für jeden Vercel-Build eingebunden werden –
 * den Build brechen, obwohl Sanity noch gar nicht eingerichtet ist.
 */
let _client: SanityClient | undefined;

export function client(): SanityClient {
  sanityPruefen();
  if (!_client) {
    _client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
      stega: { enabled: false, studioUrl },
    });
  }
  return _client;
}

export function vorschauClient(): SanityClient {
  const token = process.env.SANITY_API_READ_TOKEN;
  if (!token) throw new Error("SANITY_API_READ_TOKEN fehlt – nötig für die Entwurfsvorschau.");
  return client().withConfig({
    useCdn: false,
    token,
    perspective: "drafts",
    stega: { enabled: true, studioUrl },
  });
}
