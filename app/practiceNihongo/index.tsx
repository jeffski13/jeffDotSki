import { useMemo } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import ROUTES from "~/consts/ROUTES";

export default function HomePage() {


  return (
    <div className="homePage" >
      <Container fluid className="homePage_aboutJeff">
        <Row>
          <Col xs={6}>
            <p>愛されたい　でも　愛そうとしない　その繰り返しのなかを彷徨って</p>
            <p>僕が見つけた答えは一つ　怖くたって　傷ついたって</p>
            <p>好きな人には好きって　伝えるんだ</p>
            <p>-----------------------------</p>
            <p>「あなたが僕を愛しているか　愛してないか」なんてことは</p>
            <p>もうどっちでもいいんだ</p>
            <p>どんな願い望もうが　この世界にはかえられぬものが　沢山あるだろう</p>
            <p>そう　そして僕があなたを　愛してるという事実だけは</p>
            <p>だれにも変えられぬ　真実だから</p>
            <p>-----------------------------</p>
            <p>千の夜をこえて　あなたに伝えたい　伝えなきならないことがある</p>
            <p>愛されたい　　でも愛そうとしない　その繰り返しのなかを彷徨って</p>
            <p>僕が見つけた答えは一つ　怖くたって　傷ついたって</p>
            <p>好きな人には好きって　伝えるんだ</p>
            <p>気持ちを言葉にするのは怖いよ　でも好きな人には好きって伝えるんだ</p>
            <p>-----------------------------</p>
            <p>この広い世界に巡りあう喜びを言葉じゃ言い表せないね</p>
            <p>だから僕たちは微笑み　色鮮やかに過ぎる秋を　ドレミで歌って</p>
            <p>冬を背に　春の木漏れ日を待ち　新しく生まれ変わる　誰かを守れるようにと</p>
            <p>-----------------------------</p>
            <p>来た道と行く先　振り返ればいつでも　臆病な目をしていた僕</p>
            <p>向き合いたい　でも素直になれない　まっすぐに相手を愛せない日々を</p>
            <p>繰り返しては　一人ぼっちをいやがったあの日の僕は</p>
            <p>無傷のままで人を愛そうとしていた</p>
            <p>-----------------------------</p>
            <p>千の夜をこえて　今あなたに会いに行こう　伝えなきゃならないことがある</p>
            <p>愛されたい　でも愛そうとしない　その繰り返しの中を彷徨って</p>
            <p>僕が見つけた答えは一つ　怖くたって　傷ついたって</p>
            <p>好きな人には好きって　伝えるんだ</p>
            <p>その思いが適わなくたってt　好きな人に好きって伝える</p>
            <p>-----------------------------</p>
            <p>それは　この世界で一番　素敵なことさ</p>

            <p>source: https://www.animesonglyrics.com/bleach/sen-no-yoru-wo-koete</p>
          </Col>
          <Col xs={6}>
            <p>Aisaretai demo aisou to shinai</p>
            <p>Sono kurikaeshi no naka wo samayotte</p>
            <p>Boku ga mitsuketa kotae wa hitotsu kowakutatte kizutsuitatte</p>
            <p>Suki na hito ni wa suki tte tsutaerunda</p>
            <p>-----------------------------</p>
            <p>Anata ga boku wo aishite iru ka aishite inai ka</p>
            <p>Nante koto wa mou docchi demo iin da</p>
            <p>Donna ni negai nozomou ga</p>
            <p>Kono sekai ni wa kaerarenu mono ga takusan aru darou</p>
            <p>Sou soshite boku ga anata wo aishiteru to iu jijitsu dake wa</p>
            <p>Dare ni mo kaerarenu shinjitsu dakara</p>
            <p>-----------------------------</p>
            <p>Sen no yoru wo koete anata ni tsutaetai</p>
            <p>Tsutaenakya naranai koto ga aru</p>
            <p>Aisaretai demo aisou to shinai</p>
            <p>Sono kurikaeshi no naka wo samayotte</p>
            <p>Boku ga mitsuketa kotae wa hitotsu kowakutatte kizutsuitatte</p>
            <p>Suki na hito ni wa suki tte tsutaeru n da</p>
            <p>Kimochi wo kotoba ni suru no wa kowai yo demo</p>
            <p>Suki na hito ni wa suki tte tsutaeru n da</p>
            <p>-----------------------------</p>
            <p>Kono hiroi sekai de meguri au yorokobi wo kotoba jya ii arawasenai ne</p>
            <p>Dakara bokutachi wa hohoemi</p>
            <p>Iro azayaka ni sugiru aki wo doremi de utatte</p>
            <p>Fuyu wo se ni haru no komorebi wo machi</p>
            <p>Atarashiku umare kawaru dareka wo mamoreru youni to</p>
            <p>-----------------------------</p>
            <p>Kita michi to yukisaki furikaereba itsudemo okubyou na me wo shite ita boku</p>
            <p>Mukiaitai demo sunao ni narenai</p>
            <p>Massugu ni aite wo aisenai hibi wo</p>
            <p>Kurikaeshite wa hitoribocchi wo iyagatte</p>
            <p>Ano hi no boku wa mukizu na mama de hito wo aisou to shite ita</p>
            <p>-----------------------------</p>
            <p>Sen no yoru wo koete ima anata ni ai ni yukou</p>
            <p>Tsutaenakya naranai koto ga aru</p>
            <p>Aisaretai demo aisou to shinai</p>
            <p>Sono kurikaeshi no naka wo samayotte</p>
            <p>Boku ga mitsuketa kotae wa hitotsu kowakutatte kizutsuitatte</p>
            <p>Suki na hito ni wa suki tte tsutaeru n da</p>
            <p>Sono omoi ga kanawanakutatte suki na hito ni suki tte tsutaeru</p>
            <p>-----------------------------</p>
            <p>Sore wa kono sekai de ichiban suteki na koto sa</p>

            <p>source: https://www.animesonglyrics.com/bleach/sen-no-yoru-wo-koete</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}