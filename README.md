## usersテーブル
ユーザーを識別します。
・複数のチームを所有できます。

|Column|Type|Options|
|------|----|-------|
|name|string|null: false|
|password|string|null: false|
|email|string|null: false|
|team_id|integer|null: false, foreign_key: true|
### Association
- has_many :posts
- has_many :groups_users
- has_many :groups, through: :groups_users
- has_many :teams

##teamsテーブル
チームを定義します。
・1人のユーザーによって所有されます。
・複数の文字(chars)を所有できます。
・文字数は4~16の制限を設けます。

|Column|Type|Options|
|------|----|-------|
|name|string|null: false|
|user_id|integer|null: false, foreign_key: true|
|char_id|integer|null: false, foreign_key: true|
**Assosiation**
belongs_to :user
has_many :chars

**Validation**
validates :char_id, length: { in: 4..16 } ←文字数制限の定義方法を調査中

##charsテーブル
　・　ユーザーの指定した文字の情報がテーブルに存在すれば情報を渡します。
　・　ユーザーの指定した文字の情報がテーブルに存在しなければ新たに情報をランダム生成して格納します。
　・　1つのチームに所有されます。
　・　1つの戦闘型(btype)を所有します。
　・　1つの移動型(mtype)を所有します。
　・　1つの属性(element)を所有します。

|Column|Type|Options|
|------|----|-------|
|name|string|null: false|
|vitality|integer|null: false|
|attack|integer|null: false|
|speed|integer|null: false|
|team_id|integer|null: false, foreign_key: true|
|btype_id|integer|null: false, foreign_key: true|
|mtype_id|integer|null: false, foreign_key: true|
|element_id|integer|null: false, foreign_key: true|
**Assosiation**
belongs_to: team
belongs_to: btype
belongs_to: mtype
belongs_to: element

##btypesテーブル
　・　このテーブルは予め情報を入れ、編集しません。
　・　1つのcharによって所有されます。
　・　"space"には攻撃する座標の位置を指定します。←恐らく、もう一つテーブルの追加が必要?

|Column|Type|Options|
|------|----|-------|
|name|string|null: false|
|space|integer|null: false|
**Assosiation**
belongs_to: char

##mtypesテーブル
　・　このテーブルは予め情報を入れ、編集しません。
　・　1つのcharによって所有されます。
　・　"move"には移動方法の種類を定義します。←恐らく、もう一つテーブルの追加が必要?

|Column|Type|Options|
|------|----|-------|
|name|string|null: false|
|move|integer|null: false|
**Assosiation**
belongs_to: char

##elementsテーブル
　・　このテーブルは予め情報を入れ、編集しません。
　・　1つのcharによって所有されます。
　・　"ratio-to"には各属性に与える攻撃力の倍率が入ります。
　・　"ratio-from"には各属性から受ける攻撃力の倍率が入ります。

|Column|Type|Options|
|------|----|-------|
|name|string|null: false|
|ratio-to-fire|double|null: false|
|ratio-to-water|double|null: false|
|ratio-to-wood|double|null: false|
|ratio-to-lightness|double|null: false|
|ratio-to-darkness|double|null: false|
|ratio-from-fire|double|null: false|
|ratio-from-water|double|null: false|
|ratio-from-wood|double|null: false|
|ratio-from-lightness|double|null: false|
|ratio-from-darkness|double|null: false|
**Assosiation**
belongs_to: char

## postsテーブル
ChatSpaceの本来の機能である投稿機能に使用するテーブルです。
CHARACTER'S WAR内では使用しません。

|Column|Type|Options|
|------|----|-------|
|text|text||
|image|string||
|user_id|integer|null: false, foreign_key: true|
|group_id|integer|null: false, foreign_key: true|
### Association
- belongs_to :user
- belongs_to :group

### Validation
- validates :posts, precence: true

## groupsテーブル
ChatSpaceの本来の機能である投稿機能に使用するテーブルです。
CHARACTER'S WAR内では使用しません。

|Column|Type|Options|
|------|----|-------|
|name|string|null: false|
### Association
- has_many :posts
- has_many :groups_users
- has_many :users, through: :groups_users

## groups_usersテーブル
ChatSpaceの本来の機能である投稿機能に使用するテーブルです。
CHARACTER'S WAR内では使用しません。

|Column|Type|Options|
|------|----|-------|
|user_id|integer|null: false, foreign_key: true|
|group_id|integer|null: false, foreign_key: true|
### Association
- belongs_to :group
- belongs_to :user
