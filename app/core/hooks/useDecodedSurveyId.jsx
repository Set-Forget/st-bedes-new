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
  const [subject, ...teacherParts] = decoded.split("-");
  const teacher = teacherParts.join('-'); 

  return { subject, teacher, child: null };
};
