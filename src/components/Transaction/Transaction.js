import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import {
  Grid,
  Row,
  Col,
  ControlLabel,
  FormControl,
  FieldGroup,
  Panel } from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Transaction.css';

// Component
import Payouts from './Payouts';
import Listings from './Listings';
import CompletedTransactions from './Completed/CompletedTransactions';
import FutureTransactions from './Future/FutureTransactions';
import GrossEarnings from './GrossEarnings/GrossEarnings';
import TotalAmount from './TotalAmount';
import Loader from '../Loader';
import CustomPagination from '../CustomPagination';

// Locale
import messages from '../../locale/messages';

class Transaction extends React.Component {

  static propTypes = {
    formatMessage: PropTypes.func,
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      refetch: PropTypes.func.isRequired,
      getTransactionHistory: PropTypes.shape({
        count: PropTypes.number.isRequired,
        reservationData: PropTypes.arrayOf(PropTypes.shape({
          hostId: PropTypes.string.isRequired,
          checkIn: PropTypes.string.isRequired,
          checkOut: PropTypes.string.isRequired,
          confirmationCode: PropTypes.number.isRequired,
          listData: PropTypes.shape({
            title: PropTypes.string.isRequired
          }),
          guestData: PropTypes.shape({
            firstName: PropTypes.string.isRequired
          }),
          hostTransaction: PropTypes.shape({
            payoutId: PropTypes.number,
            payEmail: PropTypes.string,
            amount: PropTypes.number,
            currency: PropTypes.string,
            createdAt: PropTypes.string
          })
        }))
      }),
    }).isRequired
  };

  static defaultProps = {
    data: {
      loading: true,
      getTransactionHistory: {
        count: null,
        reservationData: []
      }
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 'completed',
      currentPage: 1
    };
    this.handleChange = this.handleChange.bind(this);
    this.paginationData = this.paginationData.bind(this);
  }

  handleChange(page){
    const { data: { refetch } } = this.props;
    let variables = {
      mode: page,
      currentPage: 1
    };
    this.setState({ page, currentPage: 1 });
    refetch(variables);
  }

  paginationData(currentPage){
    const { data: { refetch } } = this.props;
    let variables = { currentPage };
    this.setState({ currentPage });
    refetch(variables);
  }
    
  render() {
    const { data: {loading, getTransactionHistory, refetch} } = this.props;
    const { page, currentPage } = this.state;
    const { formatMessage } = this.props.intl;
    let page1Active, page2Active, page3Active;
    let showListings, showPayouts, showTotal, userId;
    page1Active = page === 'completed' ? s.active : '';
    page2Active = page === 'future' ? s.active : '';
    page3Active = page === 'grossEarnings' ? s.active : '';
    if(page === 'completed' || page === 'grossEarnings') {
      showPayouts = true;
    }
    if(page === 'completed' || page === 'future') {
      showTotal = true;
    }

    if(!loading && getTransactionHistory && getTransactionHistory.reservationData) {
      if(getTransactionHistory.reservationData.length > 0) {
        userId = getTransactionHistory.reservationData[0].hostId;
      }
    }

    return (
      <Panel
        className={cx("transactionPanel", s.panelHeader)}
        header={
          <ul className={cx('list-inline', s.noMargin)}>
            <li className={page1Active}>
              <a className={s.tabItem} onClick={() => this.handleChange('completed')}>
                <FormattedMessage {...messages.completedTransactions} />
              </a>
            </li>
            <li className={page2Active}>
              <a className={s.tabItem} onClick={() => this.handleChange('future')}>
               <FormattedMessage {...messages.futureTransactions} />
              </a>
            </li>
            <li className={page3Active}>
              <a className={s.tabItem} onClick={() => this.handleChange('grossEarnings')}>
                <FormattedMessage {...messages.grossEarnings} />
              </a>
            </li>
          </ul>
        }>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            {
              !loading && showTotal && getTransactionHistory && getTransactionHistory.reservationData !== null 
              && <TotalAmount 
                className={cx(s.space2, s.spaceTop1)} 
                mode={page}
                data={getTransactionHistory.reservationData}
              />
            }
          
            {
              !loading && showPayouts && <div className={s.select}>
                <Payouts className={cx(s.formWidth, s.formControlSelect, s.space1)} refetch={refetch}
                 defaultLabel={formatMessage(messages.allPayoutMethod)} 
                />
              </div>
            }
            {
              !loading && <div className={s.select}>
              <Listings className={cx(s.formWidth, s.formControlSelect, s.space1)} refetch={refetch} />
            </div>
            }
            {
              !loading && getTransactionHistory && getTransactionHistory.count > 0 && <div className={s.csvExport}>
                <a href={"/export-transaction?type=" + page + "&userId=" + userId}>
                  <FormattedMessage {...messages.exportCSV} />
                </a>
              </div>
            }
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            {
              loading && <Loader type={"text"} />
            }
            {
              !loading && page === 'completed' && getTransactionHistory && getTransactionHistory.reservationData !== null
              && <CompletedTransactions data={getTransactionHistory.reservationData} />
            }

            {
              !loading && page === 'future' && getTransactionHistory && getTransactionHistory.reservationData !== null
              && <FutureTransactions data={getTransactionHistory.reservationData} />
            }

            {
              !loading && page === 'grossEarnings' && getTransactionHistory && getTransactionHistory.reservationData !== null
               && <GrossEarnings data={getTransactionHistory.reservationData} />
            }
            {
              getTransactionHistory && getTransactionHistory.count !== null && getTransactionHistory.count > 0 && <div>
                <CustomPagination
                  total={getTransactionHistory.count}
                  currentPage={currentPage}
                  defaultCurrent={1}
                  defaultPageSize={5}
                  change={this.paginationData}
                  componentReference={page}
                  paginationLabel={formatMessage(messages.transactions)}
                /> 
              </div>
            }
          </Col>
        </Row>
      </Panel>
    );
  }
}

export default injectIntl(withStyles(s)(Transaction));
