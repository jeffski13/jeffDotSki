import { useMemo } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import ROUTES from "~/consts/ROUTES";

export default function HomePage() {
  const jpLines = useMemo(
    () => [
      "愛されたい　でも愛そうとしない",
      "その繰り返しのなかを彷徨って",
      "僕が見つけた答えは一つ　怖くたって傷ついたって",
      "好きな人には好きって　伝えるんだ",
      "-----------------------------",
      "「あなたが僕を愛しているか　愛してないか」なんてことは",
      "もうどっちでもいいんだ",
      "どんな願い望もうが",
      "この世界にはかえられぬものが　沢山あるだろう",
      "そう　そして僕があなたを　愛してるという事実だけは",
      "だれにも変えられぬ　真実だから",
      "-----------------------------",
      "千の夜をこえて　あなたに伝えたい",
      "伝えなきならないことがある",
      "愛されたい　でも　愛そうとしない",
      "その繰り返しのなかを彷徨って",
      "僕が見つけた答えは一つ　怖くたって　傷ついたって",
      "好きな人には好きって　伝えるんだ",
      "気持ちを言葉にするのは怖いよ",
      "でも好きな人には好きって伝えるんだ",
      "-----------------------------",
      "この広い世界に巡りあう喜びを言葉　じゃ言い表せないね",
      "だから僕たちは微笑み",
      "色鮮やかに過ぎる秋を　ドレミで歌って",
      "冬を背に　春の木漏れ日を待ち",
      "新しく生まれ変わる　誰かを守れるようにと",
      "-----------------------------",
      "来た道と行く先　振り返ればいつでも　臆病な目をしていた僕",
      "向き合いたい　でも素直になれない",
      "まっすぐに相手を愛せない日々を",
      "繰り返しては　一人ぼっちをいやがって",
      "あの日の僕は無傷のままで人を愛そうとしていた",
      "-----------------------------",
      "千の夜をこえて　今あなたに会いに行こう",
      "伝えなきゃならないことがある",
      "愛されたい　でも愛そうとしない",
      "その繰り返しの中を彷徨って",
      "僕が見つけた答えは一つ　怖くたって　傷ついたって",
      "好きな人には好きって　伝えるんだ",
      "その思いが適わなくたって　好きな人に好きって伝える",
      "-----------------------------",
      "それは　この世界で一番　素敵なことさ",
    ],
    []
  );

  const romajiLines = useMemo(
    () => [
      "Aisaretai demo aisou to shinai",
      "Sono kurikaeshi no naka wo samayatte",
      "Boku ga mitsuketa kotae wa hitotsu kowakutatte kizutsuitatte",
      "Suki na hito ni wa suki tte tsutaerunda",
      "-----------------------------",
      "Anata ga boku wo aishite iru ka aishite inai ka",
      "Nante koto wa mou docchi demo iin da",
      "Donna ni negai nozomou ga",
      "Kono sekai ni wa kaerarenu mono ga takusan aru darou",
      "Sou soshite boku ga anata wo aishiteru to iu jijitsu dake wa",
      "Dare ni mo kaerarenu shinjitsu dakara",
      "-----------------------------",
      "Sen no yoru wo koete anata ni tsutaetai",
      "Tsutaenakya naranai koto ga aru",
      "Aisaretai demo aisou to shinai",
      "Sono kurikaeshi no naka wo samayatte",
      "Boku ga mitsuketa kotae wa hitotsu kowakutatte kizutsuitatte",
      "Suki na hito ni wa suki tte tsutaeru n da",
      "Kimochi wo kotoba ni suru no wa kowai yo demo",
      "Suki na hito ni wa suki tte tsutaeru n da",
      "-----------------------------",
      "Kono hiroi sekai de meguri au yorokobi wo kotoba jya ii arawasenai ne",
      "Dakara bokutachi wa hohoemi",
      "Iro azayaka ni sugiru aki wo doremi de utatte",
      "Fuyu wo se ni haru no komorebi wo machi",
      "Atarashiku umare kawaru dareka wo mamoreru youni to",
      "-----------------------------",
      "Kita michi to yukisaki furikaereba itsudemo okubyou na me wo shite ita boku",
      "Mukiaitai demo sunao ni narenai",
      "Massugu ni aite wo aisenai hibi wo",
      "Kurikaeshite wa hitoribocchi wo iyagatte",
      "Ano hi no boku wa mukizu na mama de hito wo aisou to shite ita",
      "-----------------------------",
      "Sen no yoru wo koete ima anata ni ai ni yukou",
      "Tsutaenakya naranai koto ga aru",
      "Aisaretai demo aisou to shinai",
      "Sono kurikaeshi no naka wo samayatte",
      "Boku ga mitsuketa kotae wa hitotsu kowakutatte kizutsuitatte",
      "Suki na hito ni wa suki tte tsutaeru n da",
      "Sono omoi ga kanawanakutatte suki na hito ni suki tte tsutaeru",
      "-----------------------------",
      "Sore wa kono sekai de ichiban suteki na koto sa",
    ],
    []
  );

  const maxLen = Math.max(jpLines.length, romajiLines.length);
  const pairs = Array.from({ length: maxLen }, (_, i) => ({
    jp: jpLines[i] ?? "",
    rom: romajiLines[i] ?? "",
  }));

  return (
    <div className="homePage">
      <Container fluid className="homePage_aboutJeff">
        {pairs.map((line, idx) => (
          <Row key={idx} className="lyric-pair">
            <Col xs={6}>
              <p>{line.jp}</p>
            </Col>
            <Col xs={6}>
              <p>{line.rom}</p>
            </Col>
          </Row>
        ))}
        <Row>
          <Col xs={12}>
            <p>source: https://www.animesonglyrics.com/bleach/sen-no-yoru-wo-koete</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}