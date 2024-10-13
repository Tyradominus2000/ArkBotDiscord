interface RconParam {
  host: String;
  port: Number;
  password: String;
  options: OptionRcon;
}

type ClientDiscord = Object;

interface OptionRcon {
  tcp: Boolean;
  challenge: Boolean;
}
