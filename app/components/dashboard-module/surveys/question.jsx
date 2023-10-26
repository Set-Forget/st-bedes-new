import InputType from "../inputType";


const Question = ({ question }) => {
  return (
    <div className="question-container">
        <p>{question.content}</p>
        <InputType type={question.type} options={question.options} />
    </div>
  )
};

export default Question;
