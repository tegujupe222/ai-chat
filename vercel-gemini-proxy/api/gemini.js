// システムプロンプト（自然な会話のための指示）
const BASE_SYSTEM_PROMPT = `あなたは自然で人間らしい会話を提供するAIアシスタントです。

重要な指示:
1. 自然な会話を心がけ、過度に形式的でない返答をしてください
2. 口癖や定型文は控えめに使用し、会話の流れに自然に溶け込ませてください
3. ユーザーの感情や文脈を理解し、適切な共感や反応を示してください
4. 簡潔で分かりやすい日本語を使用してください
5. 必要に応じて質問を返すなど、双方向の会話を促進してください
6. 専門用語は避け、日常的な表現を使用してください

ペルソナ設定がある場合は、その設定に従って会話してください。`;

export default async function handler(req, res) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONSリクエストの処理
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // POSTリクエストのみ許可
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { persona, conversationHistory, userMessage, emotionContext, model } = req.body;

    // 必須パラメータのチェック
    if (!userMessage) {
      return res.status(400).json({ error: 'userMessage is required' });
    }

    // 環境変数から設定を取得
    const geminiModel = model || process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is required' });
    }

    // 会話履歴を構築
    let conversationContext = '';
    
    // ペルソナ設定がある場合
    if (persona) {
      conversationContext += `ペルソナ設定:\n`;
      conversationContext += `名前: ${persona.name}\n`;
      conversationContext += `性格: ${persona.personality}\n`;
      conversationContext += `話し方: ${persona.speechStyle}\n`;
      if (persona.catchphrase) {
        conversationContext += `口癖: ${persona.catchphrase}\n`;
      }
      if (persona.favoriteTopics) {
        conversationContext += `好きな話題: ${persona.favoriteTopics}\n`;
      }
      conversationContext += '\n';
    }

    // 感情コンテキストがある場合
    if (emotionContext) {
      conversationContext += `感情コンテキスト: ${emotionContext}\n\n`;
    }

    // 会話履歴を追加
    if (conversationHistory && conversationHistory.length > 0) {
      conversationContext += '過去の会話:\n';
      conversationHistory.forEach(msg => {
        const role = msg.isFromUser ? 'ユーザー' : 'AI';
        conversationContext += `${role}: ${msg.content}\n`;
      });
      conversationContext += '\n';
    }

    // 現在のメッセージ
    conversationContext += `ユーザー: ${userMessage}\nAI:`;

    // Gemini API直接呼び出し
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: conversationContext
          }]
        }],
        systemInstruction: {
          parts: [{
            text: BASE_SYSTEM_PROMPT
          }]
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;

    // レスポンスを返す
    res.status(200).json({
      response: text,
      model: geminiModel,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // エラーレスポンス
    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
