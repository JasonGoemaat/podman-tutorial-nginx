const fs = require('fs');

/********************************************************************************
 * Localization strings
 ********************************************************************************/
const localizationFileText = fs.readFileSync('../Localization.txt', 'utf-8');
const localizationRows = localizationFileText.split('\r').join('').split('\n');
const localization = localizationRows.reduce((p, c) => {
  let parts = c.split(',');
  p[parts[0]] = parts[5];
  return p;
}, {});

/********************************************************************************
 * Item Modifiers
 ********************************************************************************/
const originalItemModifiersString = fs.readFileSync('../item_modifiers.original.json', 'utf-8');
const originalItemModifiers = JSON.parse(originalItemModifiersString).item_modifiers.item_modifier;

const itemModifiers = originalItemModifiers.map(original => {
  let result = {};
  result.name = original._name;
  result.text = localization[original._name];
  result.installableTagsString = original._installable_tags;
  result.installableTags = original._installable_tags ? original._installable_tags.split(',') : [];
  result.blockedTagsString = original._blocked_tags;
  result.blockedTags = original._blocked_tags ? original._blocked_tags.split(',') : [];
  result.blockedTags = original._blocked_tags ? original._blocked_tags.split(',') : [];
  result.modifierTagsString = original._modifier_tags || '';
  result.modifierTags = result.modifierTagsString.split(',');
  return result;
});
fs.writeFileSync('../item_modifiers.json', JSON.stringify(itemModifiers, null, 2), 'utf-8');


/********************************************************************************
 * Items
 ********************************************************************************/
const originalItemsString = fs.readFileSync('../items.original.json', 'utf-8');
const originalItems = JSON.parse(originalItemsString).items.item;

const items = originalItems.map(original => {
  let result = {};
  result.text = localization[original._name];
  result.name = original._name;
  if (original.property && original.property.find) {
    const tagsProperty = original.property.find(p => p._name === 'Tags');
    if (tagsProperty) {
      result.tagsString = tagsProperty._value;
      result.tags = tagsProperty._value.split(',');
    }
  }
  if (result.tags) {
    result.modifiers = itemModifiers.filter(mod => {
      let valid = false;
      result.tags.forEach(tag => {
        if (mod.installableTags.find(x => x === tag)) {
          valid = true;
        }
      });
      if (result.blockedTags) {
        result.blockedTags.forEach(tag => {
          if (result.tags.find(x => x === tag)) {
            valid = false;
          }
        })
      }
      return valid;
    });
  } else {
    result.tags = [];
    result.modifiers = [];
  }
  result.modifiers = result.modifiers.map(x => x.name).filter(x => x.indexOf('modDye') < 0 && x.indexOf('modGunButtkick') < 0 && x.indexOf('modMeleeGunToolDecapitizer') < 0);
  result.modifierTexts = result.modifiers.map(x => localization[x] || x).sort();
  result.tags.sort();
  result.modifiers.sort();
  result.modifiersString = result.modifiers.join(',');
  result.modifierTextsString = result.modifierTexts.join(',');

  // group modifiers by tag
  result.groupedMods = result.modifiers.reduce((p, c) => {
    let mod = itemModifiers.find(x => x.name === c);
    if (mod) {
      let group = p.find(x => x.groupName === mod.modifierTagsString);
      if (!group) {
        group = { groupName: mod.modifierTagsString, modTexts: [] };
        p.push(group);
      }
      group.modTexts.push(mod.text);
    }
    return p;
  }, []);

  return result;
}).sort((a, b) => a.text < b.text ? -1 : 1);
fs.writeFileSync('../items.json', JSON.stringify(items, null, 2), 'utf-8');



