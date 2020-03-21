class TeamsController < ApplicationController
  before_action :set_user
  before_action :set_char_params
  before_action :set_team_params
  before_action :set_exist_chars

  def index
    $last_team_id = request.path.gsub(/[^\d]/, "").to_i
  end

  def new
    @team = Team.new
  end

  def create
    @team = Team.new(team_params)
    if @team.save
      @team = @team.char.chars.uniq
      @team.each do|team_chars|
        unless @exist_chars.include?(team_chars)
          @char = Char.new
          @char.name = team_chars
          st_seed = rand(1..3)
          case st_seed
            when 1 then # 体力と攻撃が優れる
              @char.vitality = rand(500..1000)
              @char.attack = rand(50..100)
              sum = @char.vitality.to_i / 10 + @char.attack.to_i
              if sum <= 133
                @char.spped = 4
              elsif sum <=166
                @char.spped = 3
              else
                @char.spped = 2
              end
            when 2 then # スピードと体力が優れる
              @char.vitality = rand(500..1000)
              @char.spped = rand(5..10)
              sum = @char.vitality.to_i / 10 + @char.spped.to_i * 10
              if sum <= 133
                @char.attack = rand(31..40)
              elsif sum <=166
                @char.attack = rand(21..30)
              else
                @char.attack = rand(11..20)
              end
            when 3 then # 攻撃とスピードが優れる
              @char.attack = rand(50..100)
              @char.spped = rand(5..10)
              sum = @char.attack.to_i + @char.spped.to_i * 10
              if sum <= 133
                @char.vitality = rand(300..399)
              elsif sum <=166
                @char.vitality = rand(200..299)
              else
                @char.vitality = rand(100..199)
              end
            end
          @char.battle_id = rand(1..3)
          @char.movement_id = rand(1..3)
          @char.element_id = rand(1..5)
          @char.save
        end
      end
      redirect_to user_teams_path(@user), notice: 'チームを作成しました'
    else
      render :new
    end
  end

  def war
    War.delete_all
    #Fieldの初期化
    Field.update_all(char_id: nil,team_id: nil)
    #初期配置状態の反映
    @fields = Field.all
    @enemyChar = "卯月コウ".chars.reverse()
    @teamChar = []
    @reserved_field_id = []
    @teams.each do|team|
      if team.id == $last_team_id
        @teamChar << team.char.chars
        @chars.each do|char|
          for num in 0..15 do
            if @teamChar[0][num] == char.name
              Field.find(364+num*16-((@teamChar[0].length/2).floor-2)*16).update(char_id: char.id,team_id: $last_team_id)
              @battleChars = War.new
              @battleChars.field_id = (364+num*16-((@teamChar[0].length/2).floor-2)*16).to_i
              @battleChars.char_id = char.id
              @battleChars.name = char.name
              @battleChars.vitality = char.vitality
              @battleChars.attack = char.attack
              @battleChars.spped = char.spped
              @battleChars.battle_id = char.battle_id
              @battleChars.movement_id = char.movement_id
              @battleChars.element_id = char.element_id
              @battleChars.team = 0
              @battleChars.save
              @reserved_field_id << (364+num*16-((@teamChar[0].length/2).floor-2)*16).to_i
            end
            if @enemyChar[num] == char.name
              Field.find(358+num*16-((@enemyChar.length/2).floor-2)*16).update(char_id: char.id,team_id: $last_team_id)
              @battleChars = War.new
              @battleChars.field_id = (358+num*16-((@enemyChar.length/2).floor-2)*16).to_i
              @battleChars.char_id = char.id
              @battleChars.name = char.name
              @battleChars.vitality = char.vitality
              @battleChars.attack = char.attack
              @battleChars.spped = char.spped
              @battleChars.battle_id = char.battle_id
              @battleChars.movement_id = char.movement_id
              @battleChars.element_id = char.element_id
              @battleChars.team = 1
              @battleChars.save
              @reserved_field_id << (358+num*16-((@enemyChar.length/2).floor-2)*16).to_i
            end
          end
        end
      end
    end
    respond_to do |format|
      format.json
      format.html
    end
    @battleChars = War.all
  end

  private
  def team_params
    params.require(:team).permit(:name,:char,char_ids: []).merge(user_id: current_user.id)
  end

  def set_user
    @user = User.find(current_user)
  end

  def set_team_params
    teams = Team.select(:name,:char)
    @teams = Team.all
  end

  def set_char_params
    @chars = Char.all
    @battles = Battle.all
    @movements = Movement.all
    @elements = Element.all
  end

  def set_exist_chars
    @exist_chars = []
    Char.all.each do|char|
      @exist_chars << char.name
    end
  end

end