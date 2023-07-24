import { useState, useEffect } from "react";

function App() {

  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(''); 

  const getMessages = async() => {
    const options = {
      method: "POST",
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({message: value}),
    }
    try{
      const response = await fetch('http://localhost:8000/completions', options);
      const data = await response.json();
      setMessage(data.choices[0].message);
    } catch(error){
      console.log(error);
    }
  }


  function createNewChat() {
    setMessage('');
    setValue('');
    setCurrentTitle('');
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage('');
    setValue('');
  };


  useEffect(() => {
    console.log(currentTitle, value, message)
    if(!currentTitle && value && message){
      setCurrentTitle(value);
    }
    if(currentTitle && value && message){
      setPreviousChats(prevChats => (
        [...prevChats, 
        {
          title: currentTitle,
          role: "user",
          content: value
        },
        {
          title: currentTitle, 
          role: message.role,
          content: message.content
        }
        ]
      ))
    }
  }, [message, currentTitle])

  const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle);
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)));
  console.log(uniqueTitles);

  return (
    <div className="app">
      <section className='side-bar'>
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className='history'>
          <li>
            {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)};
          </li>
        </ul>
        <nav>
          <p>Made by Mavis</p>
        </nav>
      </section>
      <section className='main'>
        {!currentTitle && <h1>Mavis GPT</h1>}
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => <li key={index}>
            <p className="role">{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>)}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)}/>
            <div id="submit" onClick={getMessages}>input:</div>
          </div>
          <p className="info">
          ChatGPT is a large language model developed by OpenAI, based on the GPT-3.5 architecture. 
          It is designed to understand natural language and generate human-like responses to a wide range of prompts and questions. 
          ChatGPT is trained on a massive dataset of text from the internet and is capable of conversing on a wide range of topics.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
