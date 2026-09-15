import { adresseTyp, bildTyp, linkTyp, oeffnungszeitTyp, richTextTyp } from "./objekte";
import { bausteine } from "./bausteine";
import { einstellungenTyp, leistungTyp, rechtstextTyp, seiteTyp } from "./dokumente";

export const schemaTypes = [
  // Objekte
  bildTyp,
  linkTyp,
  richTextTyp,
  adresseTyp,
  oeffnungszeitTyp,
  ...bausteine,
  // Dokumente
  einstellungenTyp,
  seiteTyp,
  leistungTyp,
  rechtstextTyp,
];
