// 初期化処理
$(function(){ 

  var identifyColor = function(){
  // チームの色分け
  $battle_chars.forEach(b => {
    fields.forEach(f =>{
      // team == 1なら敵チーム
      if(f.char_id == b.char_id && b.team == 1){
        $(`#ID_${b.field_id}`).css("transform","rotate(180deg)");
        $(`#ID_${b.field_id}`).css("color","#f00");
      // team == 0なら自チーム
      }else if(f.char_id == b.char_id && b.team == 0){
        $(`#ID_${b.field_id}`).css("transform","rotate(0deg)");
        $(`#ID_${b.field_id}`).css("color","#0f0");
      }
    })
  })
  }

  // 
  var team_chars = [];
  // 戦闘に必要な文字のパラメータをテーブルから受け取り、格納するグローバル変数(配列)
  var $battle_chars = [];
  // フィールドの情報をテーブルから受け取り、格納する変数(配列)
  var fields = [];
  // charsテーブルの情報を格納する変数(配列)
  var chars = [];
  //ビューに初期値を渡すために非同期通信を使用する
  $.ajax({
    type: 'GET',
    url: $("#field").attr('action'),
    dataType: 'json',
    success: function(data){
      // すでに文字が入っているマスを格納したインスタンス変数をjsonから受け取る
      $reserved_id = data.reserved_id
      // jsonに格納したテーブルの情報を配列で受け取る
      data.team_chars.forEach(t =>{
        team_chars.push(t);
      })
      data.battle_chars.forEach(d =>{
        $battle_chars.push(d);
      })
      data.fields.forEach(d => {
        fields.push(d);
      })
      data.chars.forEach(c =>{
        chars.push(c);
      })
    identifyColor();
    }
  })

  // 戦闘中かどうかを判定するフラグ
  var battleStartFlag = 0;
  // カーソルを合わせたマスを少し暗くする処理
  for(var num = 257;num <= 512; num ++){
    $(`#ID_${num}`).hover(function(){
      $(this).css('opacity', '0.3');
    },function(){
      $(this).css('opacity', '1');
    })
  }

  //攻撃関数
  var attack = function(field_id,spped,moveValue,char_name,team,b_attack,element_id){
    // 被攻撃チームのIDを格納する変数
    var attacking_team = -1;
    // 自チームが攻撃する場合、被攻撃チームは1(敵チーム)
    if(team == 0){
      attacking_team = 1;
    // 自チームが攻撃される場合、被攻撃チームは0(自チーム)
    }else{
      attacking_team = 0;
    }
    // 攻撃を文字自身の周囲8マスに反映させるための配列
    var attackEffects = [-17,-16,-15,-1,0,1,15,16,17];
    // スピードの数値分攻撃を繰り返す
    while(spped >= 0){
      attackEffects.forEach(e => {
        // 攻撃エフェクトを表示
        $(`#ID_${field_id+e+(moveValue*spped)}`).css('opacity', '0').animate({'opacity': '1'}, 500);
        // 攻撃を実行
        $battle_chars.forEach(b => {
          // ifで敵対チームにだけ攻撃を与える
          if(b.field_id == field_id+e+(moveValue*spped) && b.team == attacking_team){
            // 属性相性を定義
            var ratio = 0;
            switch(element_id){
              // 火属性が攻撃する場合の倍率
              case 1:
                switch(b.element_id){
                  // 相手が水だと攻撃力が減る
                  case 2:
                    ratio = 0.7;
                    break;
                  // 相手が木だと攻撃力が増える
                  case 3:
                    ratio = 1.3;
                    break;
                  // 相手が火、光、闇だと等倍
                  default:
                    ratio = 1;
                    break;
                }
                break;
              case 2:
              // 水属性が攻撃する場合の倍率
                switch(b.element_id){
                  // 相手が木だと攻撃力が減る
                  case 3:
                    ratio = 0.7;
                    break;
                  // 相手が火だと攻撃力が増える
                  case 1:
                    ratio = 1.3;
                    break;
                  // 相手が水、光、闇だと等倍
                  default:
                    ratio = 1;
                    break;
                }
                break;
              case 3:
              // 木属性が攻撃する場合の倍率
                switch(b.element_id){
                  // 相手が火だと攻撃力が減る
                  case 1:
                    ratio = 0.7;
                    break;
                  // 相手が水だと攻撃力が増える
                  case 2:
                    ratio = 1.3;
                    break;
                  // 相手が木、光、闇だと等倍
                  default:
                    ratio = 1;
                    break;
                }
                break;
              // 光属性が攻撃する場合の倍率
              case 4:
                switch(b.element_id){
                  // 相手が闇だと攻撃力が増える
                  case 5:
                    ratio = 1.3;
                    break;
                  // 相手が火、水、木、光だと等倍
                  default:
                    ratio = 1;
                    break;
                }
                break;
              case 5:
              // 闇属性が攻撃する場合の倍率
                switch(b.element_id){
                  // 相手が光だと攻撃力が増える
                  case 4:
                    ratio = 1.3;
                    break;
                  // 相手が火、水、木、闇だと等倍
                  default:
                    ratio = 1;
                    break;
                }
                break;
            }
            // 
            console.log(`${b.name} HP${parseInt(b.vitality-b_attack*ratio)}`);
            var teamText;
            if(b.team == 0){
              teamText = "あなた";
            }else{
              teamText = "敵";
            }
            if(b.vitality <= 0){
              console.log(`${teamText}の「 ${b.name} 」は死んだ！`)
            }
            // ダメージ分の体力を減らす処理
            b.vitality -= parseInt(b_attack*ratio);
          }
        })
      })
      // スピードを1減らして次のループへ。スピード0になったら終了
      spped --;
    }
  }

  // 移動および画面左右端でのループ処理
  var loopMovement = function(field_id,nextPoint,char_name){
    // 左端から右端にループする
    if(nextPoint < 256){
      nextPoint += (256 -1);
    // 右端から左端にループする
    }else if(nextPoint >= 512){
      nextPoint += (-256 +1);
    }
    //nextPointが予約済みなら、nextPointが予約済みでないマスになるまで、nextPointを1増やす
    $reserved_id.forEach(r => {
      while(r == nextPoint){
        nextPoint ++;
      }
    })
    //予約済みマスを更新
    $reserved_id = $reserved_id.filter(function( item ) { 
      return item !== field_id;
    });
    $reserved_id.push(nextPoint);
    // nextPointが確定したので、文字の位置(b.field_id)を更新する
    $battle_chars.forEach(b =>{
      if(b.name == char_name){
        b.field_id = nextPoint;
      }
    })
    // 表示位置を更新する
    $(`#ID_${nextPoint}`).text(char_name);
  }

  //移動関数
  var movement = function(spped,movement_id,field_id,char_name,team,b_attack,element_id){
    // 移動型ごとに処理を分ける
    switch(movement_id){
      // 直線往復型 ひたすら上か下に進む
      case 1:
        // 上下左右斜めのうちランダムに移動する
        var moveSeeds = [-1,1];
        // 左右にも1マス動く
        var moveRightLeftSeeds = [-16,16];
        // 0~7のランダムシードを生成
        var moveSeed = Math.round(Math.random()*1);
        // 移動値を定義
        var moveValue =  moveSeeds[moveSeed];
        // 移動する
        var nextPoint = field_id + moveValue*spped + moveRightLeftSeeds[moveSeed];
        //ループ処理
        loopMovement(field_id,nextPoint,char_name);
        //攻撃処理
        attack(field_id,spped,moveValue,char_name,team,b_attack,element_id);
        break;
      // 散策型 ランダムな8方向に直進する
      case 2:
        // 上下左右斜めのうちランダムに移動する
        var moveSeeds = [-17,-16,-15,-1,1,15,16,17];
        // 0~7のランダムシードを生成
        var moveSeed = Math.round(Math.random()*7);
        // 移動値を定義
        var moveValue =  moveSeeds[moveSeed];
        // 移動する
        var nextPoint = field_id + moveValue*spped;
        // ループ処理
        loopMovement(field_id,nextPoint,char_name);
        // 攻撃処理
        attack(field_id,spped,moveValue,char_name,team,b_attack,element_id);
        break;
      // 追尾型 一番近い敵を横切るように移動する
      case 3:
        // 上下左右斜めのうちランダムに移動する
        var moveSeeds = [-17,-16,-15,-1,1,15,16,17];
        // 0~7のランダムシードを生成
        var moveSeed = Math.round(Math.random()*7);
        // 移動値を定義
        var moveValue =  moveSeeds[moveSeed] * spped;
        // 移動する
        var nextPoint = field_id + moveValue;
        // ループ処理
        loopMovement(field_id,nextPoint,char_name);
        // 攻撃処理
        attack(field_id,spped,moveValue,char_name,team,b_attack,element_id);
        break;
    }
  }

  //チーム選択
  $(".team").on('click', function(){
    fields.forEach(f => {
      $(`#ID_${f.id}`).text("");
    })
    $battle_chars = [];
    for(var num = 0;num < 16;num ++){
      chars.forEach(c => {
        if(c.name == team_chars[num]){
          var hash = {"id":c.id,"name":c.name,"field_id":364+num*16-(Math.floor(team_chars.length/2)-2)*16,"vitality":c.vitality,"attack":c.attack,"spped":c.spped,"battle_id":c.battle_id,"movement_id":c.movement_id,"element_id":c.element_id,"team":0};
          $(`#ID_${hash.field_id}`).text(c.name);
          $battle_chars.push(hash);
        }else if(c.name == $(this).attr("data").split("")[num]){
          var hash = {"id":c.id,"name":c.name,"field_id":358+num*16-(Math.floor(team_chars.length/2)-2)*16,"vitality":c.vitality,"attack":c.attack,"spped":c.spped,"battle_id":c.battle_id,"movement_id":c.movement_id,"element_id":c.element_id,"team":1};
          $(`#ID_${hash.field_id}`).text(c.name);
          $battle_chars.push(hash);
        }
      })
    }
    console.log($battle_chars);
    $battle_chars.forEach(b => {
      fields.forEach(f =>{
        if(f.char_id == b.char_id && b.team == 1){
          // $(`#ID_${b.field_id}`).css("background","#c00");
        }
      })
    })
  })

  // クリックで戦闘開始
  $("#field").on('click', function(){
    if(battleStartFlag == 0){
      // 勝敗がついた後に停止するための変数
      battleStartFlag = 1;
      // 500msごとに画面を更新
      setInterval(reloadFields, 500);
    }
  });

  // 画面更新処理
  var reloadFields = function(){
    //勝敗判定用の変数
    var remain_chars = 0;
    var remain_enemies = 0;
    //勝敗がついていない場合だけ実行する
    if(battleStartFlag == 1){
      //移動関数実行対象マス決定用変数 デフォルトは0で1ずつ増える
      var faseNum = Number($("#field").attr('faseNum'));
      //非同期通信
      $.ajax({
        type: 'GET',
        url: $("#field").attr('action'),
        dataType: 'json',
        success: function(){
          $battle_chars.forEach(b => {
            fields.forEach(field => {
              if(field.char_id == b.char_id){
                // 空じゃないマスのfaseNumを+1する
                $(`#ID_${field.id}`).attr('faseNum',faseNum+1);
              }
              // faseNumが1多い行だけ移動関数を実行
              if(field.char_id == b.char_id && Number($(`#ID_${field.id}`).attr('faseNum')) == faseNum+1){
                // マスを全て空にする
                $(`#ID_${b.field_id}`).text("");
                if(b.vitality > 0){
                  if(b.team == 0){
                    remain_chars ++;
                  }else if(b.team == 1){
                    remain_enemies ++;
                  }
                  movement(b.spped,b.movement_id,b.field_id,b.name,b.team,b.attack,b.element_id);
                }else if(b.vitality <= 0){
                  $(`#ID_${b.field_id}`).text("");
                  b.field_id = -1;
                }
                // faseNumを元の値に戻す
                $(`#ID_${field.id}`).attr('faseNum',faseNum);
              }
            });
          })
          // faseNumを次のターンに向けて1増やす
          faseNum += 1;
          $("#field").attr('faseNum',faseNum);
          if(remain_chars == 0 && remain_enemies == 0){
            console.log("DRAW.");
            battleStartFlag = 0;
          }else if(remain_enemies == 0){
            console.log("YOU WIN!!");
            battleStartFlag = 0;
          }else if(remain_chars == 0){
            console.log("名取さな LOSE!!");
            battleStartFlag = 0;
          }
          identifyColor();
          }
        })
      .fail(function() {
        alert('error');
      })
    }
  }
});