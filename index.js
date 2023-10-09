const { Telegraf } = require("telegraf");
const bot = new Telegraf("6499240704:AAEG34Dz71GBV2iBFTnklSShpNAh2RZ10pM");
const { MongoClient } = require("mongodb");

MongoClient.connect("mongodb://localhost:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((client) => {
  const db = client.db();
  bot.use(session(db, { collectionName: "sessions" }));
});

bot.start(async (ctx) => {
  const channelInfo = await ctx.telegram.getChat("@gcenter_channel");
  const channelId = channelInfo.id;

  const memberInfo = await ctx.telegram.getChatMember(channelId, ctx.from.id);

  const isSubscribed = await ["administrator", "member", "creator"].includes(
    memberInfo.status
  );

  if (isSubscribed) {
    ctx.reply(
      `Salom, ${ctx.message.chat.first_name}\n
Botimizdan foydalanmoqchi bo'lsangiz avval telegram kanalimizga obuna bo'ling!`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Kanalga o'tish", url: "https://t.me/gcenter_channel" },
              { text: "Obuna bo'ldim", callback_data: "test_result" },
            ],
          ],
        },
      }
    );
  } else {
    ctx.reply("Kanalga obuna bo'lmagansiz", {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Kanalga o'tish", url: "https://t.me/gcenter_channel" },
            { text: "Obuna bo'ldim", callback_data: "test_result" },
          ],
        ],
      },
    });
  }
});

bot.action("test_result", async (ctx) => {
  const channelInfo = await ctx.telegram.getChat("@gcenter_channel");
  const channelId = channelInfo.id;

  const memberInfo = await ctx.telegram.getChatMember(channelId, ctx.from.id);

  const isSubscribed = await ["administrator", "member", "creator"].includes(
    memberInfo.status
  );
  if (isSubscribed) {
    ctx.reply("Siz kanalimizga obuna bo'ldingiz. ✅");
  } else {
    ctx.reply("Kanalga obuna bo'lmagansiz", {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Kanalga o'tish", url: "https://t.me/gcenter_channel" },
            { text: "Obuna bo'ldim", callback_data: "test_result" },
          ],
        ],
      },
    });
  }
});

bot.launch();
