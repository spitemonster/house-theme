module.exports = [
    {
        type: 'input',
        name: 'title',
        message: 'Enter the block title, caps and spaces is fine!',
    },
    {
        type: 'input',
        name: 'namespace',
        message: 'Enter the block namespace. All lower case would be best.',
        default: 'namespace',
    },
    {
        type: 'input',
        name: 'description',
        message: 'Enter a block description.',
    },
    {
        type: 'input',
        name: 'icon',
        message: 'Provide a WP dashicon.',
        default: 'menu',
    },
    {
        type: 'input',
        name: 'category',
        message: 'Provide a block category.',
        default: 'common',
    },
    {
        type: 'input',
        name: 'block_attributes',
        message: 'Enter any attributes by name, separated by commas.',
        default: '',
    },
]
