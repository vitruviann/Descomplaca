import React, { useState } from 'react';
import Header from '../components/Header';
import SolicitationIntro from '../components/SolicitationIntro';
import SolicitationWizard from '../components/SolicitationWizard';

const SolicitationFlow = () => {
    const [started, setStarted] = useState(false);

    return (
        <div className="bg-white">
            <Header />
            {!started ? (
                <SolicitationIntro onStart={() => setStarted(true)} />
            ) : (
                <SolicitationWizard />
            )}
        </div>
    );
};

export default SolicitationFlow;
