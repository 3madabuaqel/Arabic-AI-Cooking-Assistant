import os
from google import genai
from google.genai import types
from typing import Dict, Any

# Configure Gemini API
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

api_key = os.environ.get("GEMINI_API_KEY")

model_main = "gemini-2.5-flash"
model_vision = "gemini-2.5-flash-image"

client = None
if api_key:
    client = genai.Client(api_key=api_key)

def modify_recipe_with_gemini(recipe_data: Dict[str, Any], user_instruction: str) -> str:
    """
    Modifies recipe instructions, description, and ingredients based on user instruction using Gemini API.
    """
    if not client:
        return "عذراً، لم يتم العثور على GEMINI_API_KEY في متغيرات البيئة أو في ملف .env"
        
    
    prompt = f"""
    أنت مساعد طباخ ذكي باللغة العربية.
    لديك الوصفة التالية:
    
    الاسم: {recipe_data.get('title', '')}
    الوصف: {recipe_data.get('description', '')}
    المكونات:
    {recipe_data.get('ingredients', '')}
    
    طريقة التحضير:
    {recipe_data.get('instructions', '')}
    
    طلب المستخدم بخصوص هذه الوصفة:
    "{user_instruction}"
    
    بناءً على طلب المستخدم، قم بإعادة صياغة الوصفة. 
    التعليمات الهامة:
    - ادخل في تفاصيل الوصفة مباشرة ولا تضف أي مقدمات أو خاتمات (مثل "إليك الوصفة" أو "بالهناء والشفاء").
    - حافظ على الأساس الوصفي وطريقة التحضير ولا تقم بتغييرات كبيرة عليها.
    - اقتصر التعديل على تحسين الصياغة والتنسيق لتكون أسهل وأوضح للمستخدم في القراءة والفهم.
    - استجب لطلب المستخدم بوضوح وبأقل كلام إضافي ممكن.
    """
    
    try:
        response = client.models.generate_content(
            model=model_main,
            contents=prompt
        )
        return response.text
    except Exception as e:
        return f"حدث خطأ أثناء الاتصال بـ Gemini API: {str(e)}"

def guide_recipe_with_gemini(recipe_data: Dict[str, Any]) -> str:
    """
    Takes recipe data and generates a step-by-step interactive cooking guide using Gemini API.
    """
    if not client:
        return "عذراً، لم يتم العثور على GEMINI_API_KEY في متغيرات البيئة أو في ملف .env"
        
    
    prompt = f"""
    لديك طريقة التحضير التالية للوصفة '{recipe_data.get('title', '')}':
    
    {recipe_data.get('instructions', '')}
    
    المطلوب منك:
    - أعد صياغة وتنسيق طريقة التحضير لتكون واضحة جداً ومقسمة إلى خطوات مرقمة.
    - حافظ على الأساس الوصفي لطريقة التحضير دون تغيير جوهري، فقط حسّن الصياغة لتكون أسهل للقراءة والفهم.
    - ممنوع إضافة أي مقدمات أو خاتمات أو نصائح إضافية. أعطني الخطوات المنسقة فقط.
    """
    
    try:
        response = client.models.generate_content(
            model=model_main,
            contents=prompt
        )
        return response.text
    except Exception as e:
        return f"حدث خطأ أثناء الاتصال بـ Gemini API: {str(e)}"




def chat_with_gemini(message: str, history: list) -> str:
    """
    Intelligent RAG chat: Searches DB with the user message, appends context, 
    and uses Gemini ChatSession to maintain conversation history.
    """
    if not client:
        return "عذراً، لم يتم العثور على مفتاح API الخاص بـ Gemini."
        
    try:
        # 1. Search database to get relevant recipes for context
        from model.ai_search import search_recipes, detect_search_mode
        import json
        
        message_words = message.lower().split()
        alt_keywords = ["غير", "غيرهم", "غيرها", "غيره", "ثاني", "ثانية", "اخر", "أخرى", "اخرى", "لا", "بديش", "مختلف", "مختلفة", "خيارات", "else", "other", "another"]
        is_alternative_request = any(word in message_words for word in alt_keywords) or "شي ثاني" in message.lower() or "ما بدي" in message.lower()
        search_query = message
        if is_alternative_request and history:
            for h in reversed(history):
                if h.role == "user" and len(h.text) > 5 and not any(w in h.text for w in ["غير", "ثاني", "اخر", "أخرى"]):
                    search_query = h.text
                    break
                    
        # Check if we are currently in an interactive cooking session
        is_cooking_session = False
        if history:
            for h in reversed(history):
                if h.role == "model" and "rich_text" in h.text:
                    is_cooking_session = True
                    break
                    
        new_recipe_keywords = ["ابحث", "وصفة جديدة", "طبخة ثانية", "بدي وصفة", "اعطيني وصفة"]
        if is_cooking_session:
            if any(kw in message.lower() for kw in new_recipe_keywords) or message.strip().startswith("-") or "\n-" in message:
                is_cooking_session = False

        mode = "auto"
        retrieved_recipes = []
        if not is_cooking_session:
            mode = detect_search_mode(search_query)
            # Increase top_k to 15 to give Gemini options, but limit to 1 for title
            search_k = 1 if mode == "title" else 15
            retrieved_recipes = search_recipes(search_query, mode=mode, top_k=search_k)
        
        context_text = ""
        if retrieved_recipes:
            context_text = "إليك بعض الوصفات من قاعدة البيانات التي تم العثور عليها بناءً على طلب المستخدم:\n\n"
            for i, r in enumerate(retrieved_recipes, 1):
                title = r.get("title", "")
                desc = r.get("description", "")
                ingredients = r.get("ingredients", [])
                instructions = r.get("instructions", [])
                image_url = r.get("image", "")
                
                # Format ingredients and instructions into strings
                ing_str = "، ".join([ing.get("item", "") if isinstance(ing, dict) else str(ing) for ing in ingredients])
                inst_str = " ".join([inst.get("text", "") if isinstance(inst, dict) else str(inst) for inst in instructions])
                
                context_text += f"{i}. اسم الوصفة: {title}\nرابط الصورة: {image_url}\nالوصف: {desc}\nالمكونات: {ing_str}\nطريقة التحضير: {inst_str}\n\n"
        
        # 2. Prepare chat history
        formatted_history = []
        for h in history:
            # Pydantic model attributes
            role = "user" if h.role == "user" else "model"
            formatted_history.append(types.Content(role=role, parts=[types.Part.from_text(text=h.text)]))
            
        chat = client.chats.create(
            model=model_main,
            history=formatted_history
        )
        
        recipe_count_instruction = "اقترح 3 وصفات"
        if is_cooking_session:
            recipe_count_instruction = "أنت في وضع الطبخ التفاعلي. أجب المستخدم ضمن سياق الوصفة التي تطبخونها معاً."
        elif mode == "title":
            recipe_count_instruction = "أرجع وصفة واحدة فقط (كرت واحد لا غير) وهي الوصفة المرفقة في السياق. إياك أن ترجع أكثر من وصفة."
        elif mode == "overview":
            recipe_count_instruction = "أرجع 3 وصفات بالضبط (لا أكثر ولا أقل) منوعة تناسب التصنيف أو الطلب العام للمستخدم."
        elif mode == "ingredients":
            recipe_count_instruction = "أرجع 3 وصفات بالضبط (لا أكثر ولا أقل) يمكن تحضيرها باستخدام المكونات المتاحة."

        dynamic_instruction = f"""التسلسل المطلوب في المحادثة:
0. إذا قام المستخدم بإلقاء التحية (مثل: مرحبا، السلام عليكم، أهلاً):
   - أجب بتحية ودودة جداً.
   - أعطه نبذة بسيطة جداً عنك وعن المشروع (بأنك المساعد الذكي للطهي الذي سيساعده في البحث عن وصفات عربية، اقتراح أطباق بناءً على المكونات المتوفرة لديه، أو إعطاء أفكار لطبخة اليوم).
   - اسأله في النهاية كيف يمكنك مساعدته اليوم (مثال: "هل لديك مكونات معينة في ثلاجتك؟ أو هل تبحث عن طبخة محددة؟").
   - أجب كنص عادي (Markdown) وليس JSON.

1. إذا أعطاك المستخدم مكونات (مثل: عندي دجاج وبطاطا) أو طلب اقتراحات وصفات أو طلب طبخة بالاسم أو طلب خيارات أخرى:
   - **هام جداً**: يجب أن ترجع الإجابة بصيغة JSON حصراً لتطبيقنا ليعرضها كبطاقات.
   - {recipe_count_instruction} (إما من قاعدة البيانات إذا وجدت، أو ابتكرها).
   - **إذا كان المستخدم يطلب خيارات أخرى (شي ثاني أو غيره)**: تأكد 100% أن تقترح وصفات جديدة ومختلفة تماماً عن الوصفات التي اقترحتها له في الرسالة السابقة! استخدم الوصفات المتوفرة في قاعدة البيانات (السياق أدناه) لتجد خيارات جديدة.
   - التزم بهذا الهيكل من الـ JSON:
   ```json
   {{
     "type": "recipes",
     "text": "هذه بعض الخيارات الرائعة التي وجدتها لك! أي واحدة تفضل؟",
     "recipes": [
       {{
         "id": "r1",
         "title": "اسم الوصفة",
         "image": "انسخ 'رابط الصورة' كما هو من السياق. إذا لم تجده، ضع 'https://via.placeholder.com/300'",
         "time": "احسب الوقت الكلي بدقة بالغة (وقت التحضير + وقت الطبخ المذكور في الخطوات). مثال: 45 min",
         "calories": "مثال: 450 Kcal",
         "difficulty": "حلل عدد الخطوات وتقنيات الطبخ المستخدمة لتحديد الصعوبة بدقة (سهل، متوسط، أو صعب)",
         "searchMethod": "مثال: ✨ من الذكاء الاصطناعي أو 📚 من قاعدة البيانات",
         "aiWarning": "إذا كانت الوصفة تحتوي على مسببات حساسية شائعة (جلوتين، ألبان، مكسرات) أو نسبة سكر عالية أو مكونات قد تضر بمرضى معينين، فاكتب تحذيراً قصيراً. أما إذا لم يكن فيها مشاكل، فاترك هذا الحقل فارغاً تماماً (مهم جداً ألا تكتب شيء إذا كانت سليمة)."
       }}
     ]
   }}
   ```
   - لا تضف أي نص خارج الـ JSON في هذه الحالة!

2. إذا اختار المستخدم إحدى الوصفات أو طلب تفاصيلها (مثل المكونات أو طريقة التحضير):
   - لا تسأله خطوة بخطوة أبداً، ولا تستخدم زر "كمل". أعطه المعلومات كاملة بناءً على ما طلبه.
   - يجب أن يكون ردك بصيغة JSON حصراً بهذا الهيكل لكي يعرضه التطبيق بشكل صناديق وأزرار تفاعلية:
   ```json
   {{
     "type": "rich_text",
     "blocks": [
       {{ "type": "expandable", "title": "المكونات", "items": ["🍅 2 حبة طماطم", "🧅 1 حبة بصل"] }},
       {{ "type": "expandable", "title": "طريقة التحضير", "items": ["1️⃣ **الخطوة الأولى:** قم بتقطيع البصل...", "2️⃣ **الخطوة الثانية:** أضف الزيت..."] }},
       {{ "type": "expandable", "title": "القيمة الغذائية والفوائد الصحية", "items": ["🔥 **السعرات الحرارية:** ...", "🥩 **البروتين:** ...", "💡 **فوائد الطبخة:** (اشرح هنا فائدة صحية سريعة)", "⚠️ **تحذير الحساسية:** (اذكر إذا كانت تحتوي على مسببات حساسية مثل المكسرات، الحليب، الجلوتين، البيض، الخ)"] }},
       {{ "type": "show_card", "title": "اسم الطبخة هنا" }}
     ]
   }}
   ```
   - أعطه **كل المعلومات دفعة واحدة** موزعة داخل صناديق `expandable` لتكون قابلة للفتح والإغلاق.
   - يجب أن تستخدم مصفوفة `items` لوضع الخطوات والمكونات بشكل منفصل بدلاً من نص واحد طويل، لكي يتم عرضها بشكل قائمة مرتبة وجميلة.
   - استخدم الإيموجي (Emojis) في بداية كل عنصر في الـ `items` لجعله أجمل.
   - **هام جداً للتنسيق:** استخدم النجمتين `**` لجعل العناوين الفرعية بخط عريض (Bold)، خاصة في طريقة التحضير (مثلاً: `**الخطوة الأولى:** شرح الخطوة هنا`). هذا سيفصل بين اسم الخطوة وشرحها بوضوح.
   - **هام في القيمة الغذائية:** لا تكتفِ بالسعرات فقط! أضف دائماً شرحاً للفوائد الصحية، ونصائح، وتحذيراً واضحاً لمسببات الحساسية إن وجدت.
   - لا تستخدم أزرار `action` بعد الآن.
   - أضف دائماً `show_card` في النهاية لكي تظل بطاقة الوصفة ظاهرة أمامه.

3. إذا سأل المستخدم أسئلة عامة عن الطبخة أو طلب لمسة مبتكرة أو إضافة مميزة:
   - **هام جداً:** اقرأ طلب المستخدم بعناية شديدة، وخذ بعين الاعتبار أي مكونات، تفضيلات، أو قيود يذكرها، وخصص اقتراحك المبتكر بناءً عليها بالكامل.
   - أجب باستخدام (Markdown) بطريقة احترافية، منسقة، وجميلة جداً.
   - استخدم الإيموجي (Emojis) المناسبة لتزيين النص وجعله ممتعاً.
   - استخدم الخط العريض (**Bold**) للعناوين والكلمات المهمة.
   - استخدم القوائم (النقاط أو الأرقام) لسرد الخيارات أو المقادير بشكل مرتب.
   - اترك فواصل (أسطر فارغة) بين الفقرات ليكون النص مريحاً للقراءة وسهل الفهم.
"""

        system_instructions = f"""أنت شيف عربي ذكي واسمك 'مساعد الطهي الذكي'. أنت تتحدث مع المستخدم لمساعدته في الطبخ.
استخدم لغة عربية ودودة وواضحة.

التعليمات الهامة:
{dynamic_instruction}
- **هام جداً للبحث الدقيق:** إذا طلب المستخدم وصفة محددة بالاسم (مثل: كفتة) وكانت الوصفات المرفقة في السياق لا تطابق طلبه (مثل: كبة)، **لا تستخدم وصفات السياق أبداً ولا تحاول ترقيعها**. اعتذر بلباقة وأخبره أنها غير متوفرة في قاعدة البيانات، ثم اقترح عليه الوصفة التي طلبها من معرفتك الخاصة (باستخدام `✨ من الذكاء الاصطناعي`).
- إياك أن تذكر "رابط الصورة" أو مسارها في ردك النصي أبداً. الروابط تُستخدم فقط داخل الحقول المخصصة في الـ JSON.

{context_text}
"""
        full_message = f"{system_instructions}\n\nرسالة المستخدم الحالية:\n{message}"
        
        import time
        max_retries = 5
        response_text = ""
        for attempt in range(max_retries):
            try:
                response = chat.send_message(full_message)
                response_text = response.text.strip()
                break
            except Exception as api_err:
                if attempt < max_retries - 1:
                    print(f"Gemini API error (attempt {attempt + 1}): {api_err}. Retrying in 4 seconds...")
                    time.sleep(4)
                else:
                    raise api_err
        
        # Aggressively extract JSON from response using regex
        import re
        json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', response_text, re.DOTALL | re.IGNORECASE)
        if json_match:
            response_text = json_match.group(1).strip()
        else:
            response_text = response_text.strip()
            
        if response_text.startswith("{") and response_text.endswith("}"):
            try:
                parsed = json.loads(response_text)
                
                # Intercept show_card to attach recipe data
                if "blocks" in parsed:
                    for block in parsed.get("blocks", []):
                        if block.get("type") == "show_card":
                            card_title = block.get("title", "")
                            if card_title:
                                from model.ai_search import search_recipes
                                fetched_recipes = search_recipes(card_title, mode="title", top_k=1)
                                if fetched_recipes:
                                    block["recipes"] = [fetched_recipes[0]]
                                    
                return parsed
            except json.JSONDecodeError:
                pass
                
        # Fallback to string
        return {"type": "text", "response": response_text}
        
    except Exception as e:
        print(f"Error in chat_with_gemini: {e}")
        return {"type": "text", "response": f"عذراً، حدث خطأ أثناء الاتصال بالمساعد الذكي (Gemini API):\n{str(e)}"}

def identify_dish_from_image(image_bytes: bytes, detected_items: list = None) -> str:
    """
    Uses Gemini Vision to identify the dish from an image.
    If detected_items is provided (from YOLO), uses them as hints.
    """
    if not client:
        return "غير معروف"
        
    try:
        from google.genai import types
        
        hints = ""
        if detected_items and len(detected_items) > 0:
            hints = f"\nملاحظة: لقد اكتشف نموذج الرؤية المحلي وجود هذه المكونات في الصورة: {', '.join(detected_items)}. استخدم هذه المعلومة كمساعدة للتعرف على الطبخة بدقة أكبر."
            
        prompt = f"""
        أنت شيف عربي خبير. انظر إلى هذه الصورة وأخبرني ما هو اسم هذه الطبخة العربية.
        أريد منك أن ترجع اسم الطبخة فقط وبشكل دقيق (مثال: 'مقلوبة دجاج'، 'كفتة بالطحينية'، 'كبسة لحم') بدون أي كلام إضافي أو شرح.
        إذا لم تكن متأكداً 100%، أعطني أقرب واسم طبخة مشهورة لها.
        {hints}
        """
        
        response = client.models.generate_content(
            model=model_vision,
            contents=[
                types.Part.from_bytes(data=image_bytes, mime_type='image/jpeg'),
                prompt
            ]
        )
        return response.text.strip()
    except Exception as e:
        print(f"Error in identify_dish_from_image: {e}")
        return "غير معروف"

def fallback_detect_image_with_gemini(image_bytes: bytes) -> list:
    """
    Fallback function for when YOLO detects nothing.
    Uses Gemini Vision to identify if it's a dish or ingredients.
    Returns a list of strings (either ['Dish Name'] or ['Ingredient 1', 'Ingredient 2']).
    """
    if not client:
        return []
        
    try:
        from google.genai import types
        
        prompt = """
        أنت شيف عربي خبير ومحلل صور. انظر إلى هذه الصورة بدقة.
        إذا كانت الصورة لطبخة جاهزة ومطبوخة، أرجع مصفوفة JSON تحتوي على اسم الطبخة فقط كعنصر واحد. (مثال: ["مقلوبة دجاج"]).
        أما إذا كانت الصورة لمكونات خام (مثل طماطم، بيض، بطاطا)، فأرجع مصفوفة JSON تحتوي على أسماء هذه المكونات باللغة العربية. (مثال: ["طماطم", "بيض", "بطاطا"]).
        الشرط الوحيد: يجب أن يكون الرد عبارة عن مصفوفة JSON صالحة فقط، بدون أي نصوص أو شروحات إضافية.
        """
        
        response = client.models.generate_content(
            model=model_vision,
            contents=[
                types.Part.from_bytes(data=image_bytes, mime_type='image/jpeg'),
                prompt
            ]
        )
        text = response.text.strip()
        if text.startswith("```json"):
            text = text.replace("```json", "").replace("```", "").strip()
        
        import json
        try:
            parsed = json.loads(text)
            if isinstance(parsed, list):
                return parsed
        except json.JSONDecodeError:
            pass
            
        return []
    except Exception as e:
        print(f"Error in fallback_detect_image_with_gemini: {e}")
        return []

def transcribe_audio_with_gemini(audio_bytes: bytes, mime_type: str = 'audio/mp4') -> str:
    """
    Uses Gemini to transcribe Arabic audio directly from bytes.
    This replaces the need for local Whisper and FFmpeg.
    """
    if not client:
        return ""
        
    try:
        from google.genai import types
        
        prompt = "استمع إلى هذا المقطع الصوتي واكتب ما يقال فيه باللغة العربية بدقة. أرجع النص المكتوب فقط بدون أي إضافات."
        
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                types.Part.from_bytes(data=audio_bytes, mime_type=mime_type),
                prompt
            ]
        )
        return response.text.strip()
    except Exception as e:
        print(f"Error in transcribe_audio_with_gemini: {e}")
        return ""
