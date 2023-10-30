import { useParams } from "next/navigation";

export const useDecodedSurveyId = () => {
  const { survey_id } = useParams();

  if (!survey_id) {
    return { subject: null, teacher: null, child: null };
  }

  if (!isNaN(survey_id)) {
    return { subject: null, teacher: null, child: survey_id };
  }

  const decoded = decodeURIComponent(survey_id);
  const [subject, teacher] = decoded.split("-");

  return { subject, teacher, child: null };
};
