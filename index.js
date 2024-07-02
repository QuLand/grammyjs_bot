require('dotenv').config()
const {
    Bot,
    GrammyError,
    HttpError,
    Keyboard,
    InlineKeyboard} = require('grammy')

const { hydrate } = require('@grammyjs/hydrate')

const bot = new Bot(process.env.BOT_API_KEY);
bot.use(hydrate());

bot.api.setMyCommands([
    {
        command: 'start', description: 'Запуск бота'
    },
    {
        command: 'hello', description: 'Получить приветствие',
    },
    {
        command: 'mood', description: 'настроение',
    },
    {
        command: 'share', description: 'Чем хочешь поделиться',
    },
    {
        command: 'inline_keyboard', description: 'Чем хочешь поделиться',
    },
    {
        command: 'menu', description:'Получить меню'
    }

])


bot.command('start', async (ctx) => {
    await ctx.react('👍')
    await ctx.reply('Привет\\! Я \\- бот\\. Тг канал: *негры*', {
        parse_mode: 'MarkdownV2'
    });
})

const menuKeyboard = new InlineKeyboard()
    .text('Узнать статус заказа', 'order-status')
    .text('Обратиться в поддержку', 'support')
const backKeyboard = new InlineKeyboard().text('< назад в меню','back')

bot.command('menu', async (ctx) => {
    await ctx.reply('Выберите пункт менб', {
        reply_markup: menuKeyboard,
    });
});

bot.callbackQuery('order-status', async (ctx) => {
    await ctx.callbackQuery.message.editText('Статус заказа в пути', {
        reply_markup: backKeyboard
    });
    await ctx.answerCallbackQuery()
});

bot.callbackQuery('support', async (ctx) => {
    await ctx.callbackQuery.message.editText('Напишите ваш запрос', {
        reply_markup: backKeyboard
    });
    await ctx.answerCallbackQuery()
});

bot.callbackQuery('back', async (ctx) => {
    await ctx.callbackQuery.message.editText('Выберите пункт меню', {
        reply_markup: menuKeyboard
    });
    await ctx.answerCallbackQuery()
});

bot.command('mood', async (ctx) => {
    // const moodKeyBoard = new Keyboard().text('Хорошо').
    // row()
    //     .text('Норм')
    //     .row()
    //     .text('Плохо')
    //     .resized()
    //     .oneTime()
    const moodLabels = ['Хорошо', 'Норм', 'Плохо']
    const rows = moodLabels.map((label) => {
        return [
            Keyboard.text(label)
        ]
    })
    const moodKeyBoard2 = Keyboard.from(rows).resized()
    await ctx.reply ('Как настроение?', {
       reply_markup: moodKeyBoard2
    })

})

bot.command('share', async (ctx) => {
    const shareKeyboard = new Keyboard().requestLocation('Геолокация').requestContact('Контакт').requestPoll('Опрос')
        .placeholder('Укажи данные...').resized()
    await ctx.reply('Чем хочешь поделиться', {
        reply_markup: shareKeyboard
    })

})

bot.command('inline_keyboard', async (ctx) => {
    //const inlineKeyboard = new InlineKeyboard()
        // .text('1', 'button-1').row()
        // .text('2', 'button-2').row()
        // .text('3', 'button-3')
    const inlineKeyboard2 = new InlineKeyboard().url('перейти в тг канал', 'https://t.me/skywhyw4lker')
    await ctx.reply('Выберите цифру', {
        reply_markup: inlineKeyboard2
    })
})

// bot.callbackQuery(['button-1','button-2','button-3'], async (ctx) => {
//     await ctx.answerCallbackQuery('Ща я думаю ебать')
//     await ctx.reply('Вы выбрали цифру')
// })

bot.callbackQuery(/button-[1-3]/, async (ctx) => {
    await ctx.answerCallbackQuery()
    await ctx.reply(`Вы нажали на ${ctx.callbackQuery.data}`)
})



// bot.on("callback_query:data", async (ctx) => {
//     await ctx.answerCallbackQuery()
//     await ctx.reply(`Вы нажали кнопку: ${ctx.callbackQuery.data}`)
// })

bot.on(':contact', async (ctx) => {
    await ctx.reply('Спасибо за контакт')
})

bot.hears('Хорошо', async(ctx) => {
    await ctx.reply('Ну и хорошо что хорошо', {
        reply_markup: {remove_keyboard: true}
    })
})

bot.hears('ID', async(ctx) => {
    await ctx.reply(`Ваш id ${ctx.from.id}`)
})

bot.hears(/Привет, я Саша/, async(ctx) => {
    await ctx.reply('Фу, педик')
})

bot.catch((err) => {
    const ctx = err.ctx;
    console.log(`Error while handling update ${ctx.update.update_id}`);
    const e = err.error;

    if (e instanceof GrammyError) {
        console.error("Error in request", e.description);
    } else if (e instanceof HttpError) {
        console.error("Unknown error", e);
    }
})

bot.start();