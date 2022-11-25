require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// console.log(process.env.BOT_TOKEN);

//const token = '5506742421:AAGfQr5nyNFEbXfGAZiU8nLg1HFLK6euRkU';

const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});

// bot.start('command', msg => {
// 	bot.sendMessage(msg.chat.id, 'Ты написал старт, что будем делать дальше?');
// })

const myChatIdWork = 1876263202
const messageInform = 493687761

bot.setMyCommands([
	{command: '/start', description: 'Начало!'},
])

let countIdMessage = 0
let electric = true
let timeNoElectric = 0
let warningElectricSendMsg = false

let startCheckElectric = false

bot.on('message', async (msg) => {
	const chatId = msg.chat.id;
	const text = msg.text;

	console.log(msg)
	console.log(chatId, 'chatId')


	if (text === '/start' && chatId === myChatIdWork) {

		if (!startCheckElectric) {
			startCheckElectric = true
			setInterval(async () => {
				console.log('Начало цикла, id: ', countIdMessage)
				await bot.sendMessage(myChatIdWork, 'Проверка работы', {}).then(async (e) => {
					if (e.message_id - countIdMessage > 1) {
						countIdMessage = e.message_id
						console.log(countIdMessage)
						if (!electric) {
							console.log('Дали свет!!')
							let msg = `Свет появился! Не было света ~ ${timeNoElectric} минут`
							await bot.sendMessage(messageInform, msg, {}).then((e) => {
								electric = true
								countIdMessage = e.message_id
								timeNoElectric = 0
							})
						}
					} else if (e.message_id - countIdMessage === 1 && electric) {
						console.log('Отключили свет!')
						countIdMessage = e.message_id
						electric = false
						timeNoElectric++
						await bot.sendMessage(messageInform, 'Отключили свет', {}).then((e) => {
							console.log('Отключили свет')
							countIdMessage = e.message_id
						})
					} else {
						console.log('Без света')
						countIdMessage = e.message_id
						timeNoElectric++
					}

				})

			}, 1000 * 60)
		}


		// await bot.sendMessage(chatId, 'Ты написал старт, ну погнали', {}).then((e) => {
		// 	console.log(e)
		// 	console.log('Сообщение успешно доставленно!!!')
		// })
	}
	if (text === '/start' && chatId !== myChatIdWork) {
		await bot.sendMessage(chatId, 'Работаю', {}).then((e) => {
			console.log(e)
			console.log('Сообщение успешно доставленно!!!')
		})
	}


});



















