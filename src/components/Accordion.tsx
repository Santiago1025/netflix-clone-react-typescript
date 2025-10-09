import styles from "../styles/landing-page.module.scss";
import { faq } from "../static/faq";

const Accordion = () => {
  return (
    <ul className={styles.accordion}>
      {faq.map((que, qIdx) => {
        return (
          <li key={qIdx}>
            <details>
              <summary>{que.question}</summary>
              {Array.isArray(que.answer)
                ? que.answer.map((ans, aIdx) => <p key={aIdx}>{ans}</p>)
                : <p>{que.answer}</p>}
            </details>
          </li>
        );
      })}
    </ul>
  );
};

export default Accordion;
