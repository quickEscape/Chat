import React from "react";
import "./styles.css";
import * as db from "./database.json";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:3000";

const translations = {
  "en": {
    "header": "Chat of 'PL-3' group",
    "desc": "The machine is controlled from the arrows on the keyboard",
    "submitButton": "send",
    "messagePlaceholder": "Text",
    "passwordPlaceholder": "Password",
    "logInButton": "Enter",
    "welcome": "Welcome",
    "logInError": "Вы ввели не правельный пароль или вы не зарегестрированы на этом сайте, если хотите зарегестрироватся отправте сообщение на мою почту - terentismark2007@gmail.com"
  },
  "ru": {
    "header": "Чат 'ПЛ-3'",
    "desc": "Машинка управляется со стрелочек на клавиатуре",
    "submitButton": "Отправить",
    "messagePlaceholder": "Текст",
    "passwordPlaceholder": "Пароль",
    "logInButton": "Зайти",
    "welcome": "Приветствуем",
    "logInError": "Вы ввели не правельный пароль или вы не зарегестрированы на этом сайте, если хотите зарегестрироватся отправте сообщение на мою почту - terentismark2007@gmail.com"
  },
  "ua": {
    "header": "Чат 'ПЛ-3'",
    "desc": "Машинка управляється зі стрілок на клавіатурі",
    "submitButton": "Надіслати",
    "messagePlaceholder": "Текст",
    "passwordPlaceholder": "Пароль",
    "logInButton": "Увійти",
    "welcome": "Вітаємо",
    "logInError": "Вы ввели не правельный пароль или вы не зарегестрированы на этом сайте, если хотите зарегестрироватся отправте сообщение на мою почту - terentismark2007@gmail.com"
  }
}
const passwords = {
  "mark": "000001",
  "mustafa": "000002",
  "gg": "000003"
}

function Message(props) {
  return ( <
    p > {
      props.name
    }: {
      props.message
    } <
    /p>
  );
}

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      response:"",
      lang: "ru",
      message: "",
      password: "",
      chat: [],
      logIn: false,
      user: null
    };
  }
  sendMassage(event) {
    event.preventDefault();

    if (this.state.message.trim() === "") {
      return;
    }

    let chat = this.state.chat.slice();
    chat.unshift({
      id: Date.now(),
      name: this.state.user,
      message: this.state.message
    });
    this.setState({
        chat
      },
      () => this.clearMessage()
    );
  }
  componentDidMount() {
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", response => {
      this.setState({response});
    });
    this.setState({
      chat: db.chat
    });
  }

  checkLogIn() {
    let user = Object.entries(passwords).find(
      ([, password]) => password === this.state.password
    );
    if (user) {
      this.setState({
        logIn: true,
        user: user[0]
      });
    } else {
      alert(translations[this.state.lang].logInError);
    }
  }
  clearMessage() {
    this.setState({
      message: ""
    });
  }
  changeLanguage(event) {
    this.setState({
      lang: event.target.value
    });
  }
  chengeMessage(event) {
    this.setState({
      message: event.target.value
    });
  }
  chengePassword(event) {
    this.setState({
      password: event.target.value
    });
  }
  render() {
    console.log(this.state.lang);
    return ( <
        div className = "center" >
        <
        select onChange = {
          (event) => this.changeLanguage(event)
        }
        value = {
          this.state.lang
        } >
        <
        option value = "ru" > Руский < /option> <
        option value = "ua" > Українська < /option> <
        option value = "en" > English < /option> < /
        select > <
        h1 > {
          translations[this.state.lang].header
        } < /h1> {
        this.state.logIn ? ( <
          >
          {
            " "
          } <
          h3 > {
            translations[this.state.lang].welcome
          }, {
            this.state.user
          }!
          <
          /h3> <
          form onSubmit = {
            (event) => this.sendMassage(event)
          } >
          <
          textarea value = {
            this.state.message
          }
          onChange = {
            (event) => this.chengeMessage(event)
          }
          placeholder = {
            translations[this.state.lang].messagePlaceholder
          } >
          <
          /textarea> <
          button type = "submit" > {
            translations[this.state.lang].submitButton
          } <
          /button> < /
          form > <
          div class = "chat" > {
            this.state.chat.map((item) => ( <
              Message key = {
                item.id
              }
              name = {
                item.name
              }
              message = {
                item.message
              }
              />
            ))
          } <
          /div> < / >
        ) : ( <
          >
          <
          input value = {
            this.state.password
          }
          type = "password"
          onChange = {
            (event) => this.chengePassword(event)
          }
          placeholder = {
            translations[this.state.lang].passwordPlaceholder
          } >
          <
          /input> <
          button onClick = {
            () => this.checkLogIn()
          } > {
            translations[this.state.lang].logInButton
          } <
          /button> < / >
        )
      } {
        /* <p>{translations[this.state.lang].desc}</p> */
      } <
      /div>
  );
}
}