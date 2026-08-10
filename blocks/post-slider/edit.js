import { __ } from '@wordpress/i18n'
import { useBlockProps, InspectorControls } from '@wordpress/block-editor'
import { useSelect } from '@wordpress/data'
import {
    SelectControl,
    PanelBody,
    FormTokenField,
    // eslint-disable-next-line @wordpress/no-unsafe-wp-apis
    __experimentalNumberControl as NumberControl,
    ToggleControl,
} from '@wordpress/components'
import { useEffect, useCallback, useRef, useMemo } from 'react'
import BlazeSlider from 'blaze-slider'

export default function Edit({ attributes, setAttributes }) {
    const {
        selectedPostType,
        selectedPosts,
        postsVisible,
        postsToSlide,
        autoplay,
        loop,
    } = attributes

    const sliderEl = useRef(null)

    // get all postTypes on load
    const availablePostTypes = useSelect((select) => {
        return select('core').getPostTypes({
            per_page: -1,
        })
    }, [])

    const postTypes = useMemo(() => {
        if (!availablePostTypes) {
            return []
        }

        return availablePostTypes
            .filter(
                (type) =>
                    type.viewable &&
                    type.slug !== 'page' &&
                    type.slug !== 'attachment'
            )
            .map((type) => ({
                value: type.slug,
                label: type.name,
            }))
    }, [availablePostTypes])

    useEffect(() => {
        const slider = sliderEl.current

        if (slider) {
            // eslint-disable-next-line no-shadow
            const { postsVisible, postsToSlide, autoplay, loop } =
                slider.dataset

            const config = {
                slidesToScroll: Number(postsToSlide),
                enableAutoplay: Boolean(autoplay),
                loop: Boolean(loop),
                slidesToShow: Number(postsVisible),
            }

            new BlazeSlider(slider, {
                all: config,
            })
        }
    }, [sliderEl])

    const posts = useSelect(
        (select) =>
            select('core').getEntityRecords('postType', selectedPostType, {
                per_page: -1,
                _embed: true,
            }),
        [selectedPostType]
    )

    const media = useSelect(
        (select) => {
            const imgs = {}
            selectedPosts.forEach(({ id }) => {
                const record = select('core').getEditedEntityRecord(
                    'postType',
                    selectedPostType,
                    id
                )
                const mediaId = record?.featured_media
                imgs[id] = mediaId
                    ? select('core').getMedia(mediaId)?.source_url
                    : ''
            })
            return imgs
        },
        [selectedPosts, selectedPostType]
    )

    const postOptions = useMemo(() => {
        return posts
            ? posts.map((post) => {
                  return {
                      id: post.id,
                      title: post.title.raw,
                      excerpt: post.excerpt.raw,
                      featuredImage: post.featured_media,
                  }
              })
            : []
    }, [posts])

    const handlePostSelection = useCallback(
        (tokens) => {
            const selected = tokens.reduce((acc, token) => {
                const matchingPost = postOptions.find(
                    (post) => post.title === token
                )
                if (matchingPost) {
                    acc.push({
                        id: matchingPost.id,
                        title: matchingPost.title,
                        excerpt: matchingPost.excerpt,
                        featuredImage: matchingPost.featuredImage,
                    })
                }
                return acc
            }, [])

            setAttributes({ selectedPosts: selected })
        },
        [postOptions, setAttributes]
    )

    return (
        <>
            <InspectorControls>
                <PanelBody title="Posts" initialOpen={false}>
                    <SelectControl
                        label={__('Select Post Type', 'house-theme')}
                        value={selectedPostType}
                        options={[
                            { value: '', label: 'Select a Post Type' },
                            ...postTypes,
                        ]}
                        onChange={(value) =>
                            setAttributes({
                                selectedPostType: value,
                                selectedPosts: [],
                            })
                        }
                    />
                    <FormTokenField
                        label={__('Select Posts', 'house-theme')}
                        value={selectedPosts.map(
                            (selectedPost) =>
                                postOptions.find(
                                    (post) => post.id === selectedPost.id
                                )?.title || ''
                        )}
                        suggestions={postOptions.map((post) => post.title)}
                        onChange={handlePostSelection}
                    />
                    <NumberControl
                        __next40pxDefaultSize
                        label={__('Posts Visible', 'house-theme')}
                        value={postsVisible}
                        min={1}
                        max={selectedPosts.length}
                        onChange={(value) =>
                            setAttributes({ postsVisible: value })
                        }
                    />
                    <NumberControl
                        __next40pxDefaultSize
                        label={__('Posts to Slide', 'house-theme')}
                        value={postsToSlide}
                        min={1}
                        max={selectedPosts.length}
                        onChange={(value) =>
                            setAttributes({ postsToSlide: value })
                        }
                    />
                    <ToggleControl
                        label={__('Autoplay', 'house-theme')}
                        value={autoplay}
                        checked={autoplay}
                        onChange={(value) => setAttributes({ autoplay: value })}
                    />
                    <ToggleControl
                        label={__('Loop', 'house-theme')}
                        value={loop}
                        checked={loop}
                        onChange={(value) => setAttributes({ loop: value })}
                    />
                </PanelBody>
            </InspectorControls>
            <div {...useBlockProps()}>
                {!selectedPostType && 'Select a post type.'}

                {selectedPosts.length === 0 && 'No Posts'}

                {selectedPosts.length > 0 && (
                    <div
                        className="blaze-slider"
                        data-posts-visible={postsVisible}
                        data-posts-to-slide={postsToSlide}
                        data-autoplay={autoplay}
                        data-loop={loop}
                        ref={sliderEl}
                    >
                        <div className="blaze-container">
                            <div className="blaze-track-container">
                                <ul className="blaze-track">
                                    {selectedPosts.map((post, index) => {
                                        return (
                                            <li key={index}>
                                                <figure className="post-card">
                                                    <img
                                                        src={media[post.id]}
                                                        alt={post.title}
                                                    />
                                                    <figcaption>
                                                        {post?.excerpt ||
                                                            post?.title ||
                                                            __(
                                                                'No title available',
                                                                'house-theme'
                                                            )}
                                                    </figcaption>
                                                </figure>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
