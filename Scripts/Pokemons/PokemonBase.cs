using UnityEngine;

[CreateAssetMenu(fileName = "Pokemon", menuName = "Pokemon/Create new pokemon")]
// ポケモンのマスターデータ：外部から変更しない（インスペクターだけ変更可能）
public class PokemonBase : ScriptableObject
{
    [SerializeField] new string name;

    [TextArea]
    [SerializeField] string description;

    [SerializeField] Sprite frontSprite;
    [SerializeField] Sprite backSprite;

    [SerializeField] PokemonType type1;

    [SerializeField] int maxHp;
    [SerializeField] int attack;
    [SerializeField] int defense;
    [SerializeField] int speed;

    [SerializeField] int firstGauge;


    // プロパティ
    // public の代わり
    // 他のファイルから値は取得できるが変更できない
    // set は変更可能
    public string Name
    {
        get { return name; }
    }
    public string Description
    {
        get { return description; }
    }
    public Sprite BackSprite
    {
        get { return backSprite; }
    }
    public Sprite FrontSprite
    {
        get { return frontSprite; }
    }
    public PokemonType Type1
    {
        get { return type1; }
    }
    public int MaxHp
    {
        get { return maxHp; }
    }
    public int Attack
    {
        get { return attack; }
    }
    public int Defense
    {
        get { return defense; }
    }
    public int Speed
    {
        get { return speed; }
    }
    public int FirstGauge
    {
        get { return firstGauge; }
    }





    public enum PokemonType
    {
        None,
        Normal,
        Fire,
        Water,
        Grass

    }

}
