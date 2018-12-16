Игрок логинится и получает возможности:
* создать игру
* присоединиться к существующей неначатой игре

После присоединения к игре:
* если 3 ил 4 игрока присоединились к игре, то если все сообщили, что готовы, то игра начинается

Описание API:

* Auth:
  - /signup
  - /login
  - /logout

* User:
  - /user/user_id/invites
  - /user/user_id/stats
  - /user/user_id

* Game:
  - /game/new
  - /game/pending
  - /game/id/invite/hash
  - /game/id/join
  - /game/id/leave
  - /game/id/players
  - /game/id/start
  - /game/id/close
  - /game/id/state
  - /game/id/contract
  - /game/id/move
  - /game/id/finish


В базе хранится:
  - таблица пользователей (друзья)
  - таблица игр (конечное состояние игры)

