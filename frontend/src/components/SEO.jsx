import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, name, type }) => {
    return (
        <Helmet>
            { /* Standard metadata tags */}
            <title>{title ? `${title} | Despachante Digital` : 'Despachante Digital'}</title>
            <meta name='description' content={description} />

            { /* End Standard metadata tags */}

            { /* Facebook tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            { /* End Facebook tags */}

            { /* Twitter tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content={type} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            { /* End Twitter tags */}
        </Helmet>
    )
}

SEO.defaultProps = {
    title: 'Despachante Digital',
    description: 'Regularize seu veículo online, rápido e fácil.',
    name: 'Despachante Digital',
    type: 'website'
};

export default SEO;
