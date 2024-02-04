const OR_SWITCH = 'data:image/png;base64,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'
const AND_SWITCH = 'data:image/png;base64,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'
const ADD_IMAGE = 'data:image/png;base64,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'
const DEL_IMAGE = 'data:image/png;base64,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'
const LINK_IMAGE = 'data:image/png;base64,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'
const EDIT_IMAGE = 'data:image/png;base64,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'
export { OR_SWITCH, AND_SWITCH, ADD_IMAGE, DEL_IMAGE, LINK_IMAGE, EDIT_IMAGE }