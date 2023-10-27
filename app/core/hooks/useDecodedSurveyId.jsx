import { useParams } from "next/navigation";

export const useDecodedSurveyId = () => {
  const { survey_id } = useParams();

  if (!survey_id) {
    return { subject: null, teacher: null };
  }

  const decoded = decodeURIComponent(survey_id);
  const [subject, teacher] = decoded.split("-");

  return { subject, teacher };
};
