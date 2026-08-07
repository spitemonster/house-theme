import { useBlockProps, RichText } from '@wordpress/block-editor'

export default function save({ attributes }) {
    const { mediaURL, content, url } = attributes

    function renderCard() {
        return (
            <figure {...useBlockProps.save()}>
                <img src={mediaURL} alt="" />
                <figcaption>
                    <RichText.Content tagName="p" value={content} />
                </figcaption>
            </figure>
        )
    }

    return (
        <>
            {url ? (
                <a style={{ display: 'block' }} href={url}>
                    {renderCard()}
                </a>
            ) : (
                renderCard()
            )}
        </>
    )
}
