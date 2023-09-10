export function contentEditableElementsList()
{
    let list : string[] = [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'a',
        'p',
        'span',
        'b',
        'button',
    ];

    return list;
}

export function allowedEditElementsList()
{
    let list : string[] = [
        'H1',
        'H2',
        'H3',
        'H4',
        'H5',
        'H6',
        'A',
        'P',
        'SPAN',
        'B',
        'BUTTON',
        'IMG',
       // 'DIV',
        'DL',
    ];

    return list;
}

export function getElementFriendlyName(tagName)
{
    let elementFriendlyName = tagName;
    if (tagName == 'DIV') {
        elementFriendlyName = 'Block';
    }
    if (tagName == 'IMG') {
        elementFriendlyName = 'Image';
    }
    if (tagName == 'P') {
        elementFriendlyName = 'Paragraph';
    }
    if (tagName == 'A') {
        elementFriendlyName = 'Link';
    }
    if (tagName == 'H1') {
        elementFriendlyName = 'Title 1';
    }
    if (tagName == 'H1') {
        elementFriendlyName = 'Title 1';
    }
    if (tagName == 'H2') {
        elementFriendlyName = 'Title 2';
    }
    if (tagName == 'H3') {
        elementFriendlyName = 'Title 3';
    }
    if (tagName == 'H4') {
        elementFriendlyName = 'Title 4';
    }
    if (tagName == 'H5') {
        elementFriendlyName = 'Title 5';
    }
    if (tagName == 'H6') {
        elementFriendlyName = 'Title 6';
    }

    return elementFriendlyName;
}

export function elementHasParentsWithId(element, id) {
    if (!element) {
        return false;
    }
    do {
        if (element && element.id && element.id == id) {
            return true;
        }
        element = element.parentNode;
    } while (element);
    return false;
}

export function elementHasParentsWithAttribute(element, attributeKey) {
    if (!element) {
        return false;
    }
    do {
        if (element && element.attributes &&
            element.attributes.length > 0
            && element.hasAttribute(attributeKey)) {
            return element;
        }
        element = element.parentNode;
    } while (element);
    return false;
}
export function elementHasParentsWithTagName(element, tagName) {
    if (!element) {
        return false;
    }
    do {
        if (element && element.tagName &&
            element.tagName.length > 0
            && element.tagName.toUpperCase() == tagName.toUpperCase()) {
            return element;
        }
        element = element.parentNode;
    } while (element);
    return false;
}
