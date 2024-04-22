export interface ItemModGroup {
  groupName: string,
  modTexts: string[]
}

/*
    "groupedMods": [
      {
        "groupName": "barrelAttachment",
        "modTexts": [
          "Barrel Extender Mod",
          "Muzzle Brake Mod",
          "Silencer Mod"
        ]
      },
*/

export interface Item {
  name: string,
  text: string,
  tagsString: string,
  tags: string[],
  modifiers: string[],
  modifiersString: string,
  modifierTexts: string[],
  groupedMods: ItemModGroup[]
}
