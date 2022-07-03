import React, {useState, useEffect, useContext} from 'react';
import Modal from 'react-modal';
import {Line} from 'rc-progress';
import chatContext, {controlMessageEnum} from './ChatContext';
import {PollContext} from './PollContext';
import styles from './pollStyles';

const Poll = () => {
  const {
    question,
    setQuestion,
    answers: voteData,
    setAnswers,
    isModalOpen,
    setIsModalOpen,
  } = useContext(PollContext);

  const {sendControlMessage} = useContext(chatContext);
  const [totalVotes, setTotalVotes] = useState(0);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    if (voteData.length > 0) {
      setTotalVotes(
        voteData.map((item) => item.votes).reduce((prev, next) => prev + next),
      );
    }
  }, [voteData]);

  const submitVote = (e, chosenAnswer) => {
    if (!voted) {
      const newAnswers = voteData.map((answer) => {
        if (chosenAnswer.option === answer.option) {
          return {...answer, votes: answer.votes + 1};
        } else {
          return answer;
        }
      });
      setAnswers(newAnswers);
      sendControlMessage(controlMessageEnum.initialPoll, {
        question,
        answers: newAnswers,
      });
      setTotalVotes((prevTotalVotes) => prevTotalVotes + 1);
      setVoted((prevVoted) => !prevVoted);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTotalVotes(0);
    setVoted(false);
    setQuestion('');
    setAnswers([
      {option: '', votes: 0},
      {option: '', votes: 0},
      {option: '', votes: 0},
      {option: '', votes: 0},
    ]);
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Poll Modal"
      style={styles.customStyles}>
      <div>
        <h1>{question}</h1>
        <div style={styles.flexColumn}>
          {voteData &&
            voteData.map((item, i) =>
              !voted ? (
                <button
                  style={styles.button}
                  key={i}
                  onClick={(e) => submitVote(e, item)}>
                  {console.log(item.option)}
                  {item.option}
                </button>
              ) : (
                <div style={styles.flexCenter}>
                  <h2 style={styles.mr20}>{item.option}</h2>
                  <Line
                    percent={(item.votes / totalVotes) * 100}
                    strokeWidth="5"
                    trailWidth="3"
                  />
                  <p style={styles.ml20}>{item.votes}</p>
                </div>
              ),
            )}
        </div>
        <h3>Total Votes: {totalVotes}</h3>
      </div>
    </Modal>
  );
};

export default Poll;
