import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import {connect} from 'react-redux';
import DropzoneComponent from 'react-dropzone-component';
import cx from 'classnames';
import {Col} from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '!isomorphic-style-loader!css-loader!./filepicker.css';

// Locale
import messages from '../../../locale/messages';

import { 
    doUploadProfilePicture, 
    doRemoveProfilePicture, 
    startProfilePhotoLoader 
} from '../../../actions/manageUserProfilePicture';

class Dropzone extends Component {

    static propTypes = {
        doUploadProfilePicture: PropTypes.func.isRequired,
        doRemoveProfilePicture: PropTypes.func.isRequired,
        startProfilePhotoLoader: PropTypes.func.isRequired,
        guestPicture: PropTypes.string,
        formatMessage: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.success = this.success.bind(this);
        this.removeExistingFile = this.removeExistingFile.bind(this);
        this.addedfile = this.addedfile.bind(this);
        this.dropzone = null;
    }

    componentDidMount() {
        const isBrowser = typeof window !== 'undefined';
        const isDocument = typeof document !== undefined;
        if (isBrowser && isDocument) {
            document.querySelector(".dz-hidden-input").style.visibility = 'visible';
            document.querySelector(".dz-hidden-input").style.opacity = '0';
            document.querySelector(".dz-hidden-input").style.height = '100%';
            document.querySelector(".dz-hidden-input").style.width = '100%';
            document.querySelector(".dz-hidden-input").style.cursor = 'pointer';
        }
    }
    
    componentDidUpdate() {
        const isBrowser = typeof window !== 'undefined';
        const isDocument = typeof document !== undefined;
        if (isBrowser && isDocument) {
            document.querySelector(".dz-hidden-input").style.visibility = 'visible';
            document.querySelector(".dz-hidden-input").style.opacity = '0';
            document.querySelector(".dz-hidden-input").style.height = '100%';
            document.querySelector(".dz-hidden-input").style.width = '100%';
            document.querySelector(".dz-hidden-input").style.cursor = 'pointer';
        }
    }

    success(file, fromServer) {
        const {doUploadProfilePicture, guestPicture} = this.props;
        let fileName = fromServer.file.filename;
        doUploadProfilePicture(fileName, guestPicture);
    }

    addedfile(file, fromServer) {
        const { startProfilePhotoLoader } = this.props;
        startProfilePhotoLoader();
    }

    removeExistingFile(fileName) {
        const {doRemoveProfilePicture} = this.props;
        this.dropzone.removeAllFiles();
        doRemoveProfilePicture(fileName);
    }

    render() {
        const { formatMessage } = this.props.intl;
        const { defaultMessage } = this.props;
        const djsConfig = {
            dictDefaultMessage: '',
            addRemoveLinks: false,
            uploadMultiple: false,
            maxFilesize: 10,
            acceptedFiles: 'image/*',
            dictMaxFilesExceeded: 'Remove the existing image and try upload again',
            previewsContainer: false,
            hiddenInputContainer: '.dzInputContainer'
        };
        const componentConfig = {
            iconFiletypes: ['.png'],
            postUrl: '/uploadProfilePhoto'
        };
        const eventHandlers = {
            init: dz => this.dropzone = dz,
            success: this.success,
            addedfile: this.addedfile
        };

        return (
            <div className={cx('dzInputContainer')}>
                    <DropzoneComponent
                        config={componentConfig}
                        eventHandlers={eventHandlers}
                        djsConfig={djsConfig} 
                    >{defaultMessage}
                    </DropzoneComponent>
            </div>
        );
    }
}

const mapState = (state) => ({
});

const mapDispatch = {
    doUploadProfilePicture,
    doRemoveProfilePicture,
    startProfilePhotoLoader
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(Dropzone)));
