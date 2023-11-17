import React, { useEffect } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import localeDa from "dayjs/locale/da";
import localizedFormat from "dayjs/plugin/localizedFormat";
import styled from "styled-components";
import IconCheck from "./icon-check.svg";
import IconExclamation from "./icon-exclamation.svg";
import IconCalendarPlus from "./icon-calendar-plus.svg";

/**
 * Single resource calendar.
 *
 * @param {object} props - The props.
 * @param {object} props.content - The content.
 * @param {Array} props.calendarEvents - The calendar events.
 * @param {Array} props.templateClasses - The template classes.
 * @param {object} props.templateRootStyle - The template root style.
 * @param {Function} props.getTitle - Function to get title for event.
 * @returns {string} - The component.
 */
function CalendarSingleBooking({
  content,
  calendarEvents,
  templateClasses,
  templateRootStyle,
  getTitle,
}) {
  const { title = "", subTitle = null, resourceAvailableText = null } = content;

  /** Imports language strings, sets localized formats. */
  useEffect(() => {
    dayjs.extend(localizedFormat);
  }, []);

  const renderTimeOfDay = (unixTimestamp) => {
    return dayjs(unixTimestamp * 1000)
      .locale(localeDa)
      .format("HH:mm");
  };

  const renderSingle = (calendarEventsToRender) => {
    const now = dayjs();
    const elements = [];

    if (calendarEventsToRender.length > 0) {
      calendarEventsToRender
        .filter(
          (e) => e.endTime > now.unix() && e.endTime <= now.endOf("day").unix()
        )
        .forEach((event) => {
          if (elements.length < 3) {
            elements.push(
              <ContentItem
                key={event.id}
                className={
                  elements.length === 0
                    ? "content-item single--now"
                    : "content-item single--next"
                }
              >
                <Meta>
                  {renderTimeOfDay(event.startTime)}
                  {" - "}
                  {renderTimeOfDay(event.endTime)}
                </Meta>
                {getTitle(event.title)}
              </ContentItem>
            );
          }
        });
    }

    return elements.concat();
  };

  const roomFree = true;

  return (
    <Wrapper
      className={`calendar-single-booking ${templateClasses.join(" ")}`}
      style={templateRootStyle}
    >
      <Header style={{backgroundColor: roomFree ? 'var(--color-green-900)' : 'var(--color-red-900)'}}>
        <RoomInfo>
          {subTitle && <SubTitle className="subtitle">{subTitle}</SubTitle>}
          <Title className="title">{title}</Title>
        </RoomInfo>
        <Status>
          <StatusIcon>{roomFree ? <IconCheck style={{color: 'var(--color-green-600)'}}/> : <IconExclamation style={{color: 'var(--color-red-600)'}}/> }</StatusIcon>
          <StatusText>{roomFree ? 'Ledigt' : 'Optaget'}</StatusText>
        </Status>
        <DateTime style={{backgroundColor: roomFree ? 'var(--color-green-50)' : 'var(--color-red-50)'}}>
          <Date>Mandag 7. august</Date>
          <Time>9:54</Time>
        </DateTime>
      </Header>
      <Content className="content">
        {roomFree ?
          (
            <ContentItem className="content-item">
              <h1>Lokalet er ledigt</h1>
              <p>Straksbook lokalet. Vælg varighed.</p>
              <ButtonWrapper>
                <Button><IconCalendarPlusWrapper /><span>15 min</span></Button>
                <Button><IconCalendarPlusWrapper /><span>30 min</span></Button>
                <Button><IconCalendarPlusWrapper /><span>60 min</span></Button>
              </ButtonWrapper>
            </ContentItem>
          )
        :
          calendarEvents?.length === 0 && (
            <ContentItem className="content-item">
              {resourceAvailableText}
            </ContentItem>
          )
        }
        {calendarEvents?.length > 0 && renderSingle(calendarEvents)}
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  /* Wrapper styling */
  font-family: var(--font-family-base);
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  /*
  --bg-color is local to this template file and is populated from configuration.
  --background-color serves as fallback to the global variable, that will serve a light og dark background color depending on the user preferences.
  */
  background-color: var(--bg-color, var(--background-color));
  background-image: var(--bg-image, none);

  color: var(--text-color);
`;

const Header = styled.div`
  /* Header styling */
  display: flex;
`;

const RoomInfo = styled.div`
  /* RoomInfo styling */
  padding: calc(var(--padding-size-base) * 2);
  flex-grow: 2;
  color: var(--text-light);
`;

const Title = styled.div`
  font-size: var(--h2-font-size);
  font-weight: var(--font-weight-bold);
`;

const SubTitle = styled.div`
  font-size: var(--font-size-lg);
`;

const Status = styled.div`
  /* Status styling */
  padding: var(--padding-size-base);
  padding-right: calc(var(--padding-size-base) * 3);
  display: flex;
  column-gap: var(--spacer);
  align-items: center;
`;

const StatusIcon = styled.div`
  /* StatusIcon styling */
  height: var(--h2-font-size);
  width: var(--h2-font-size);
`;

const StatusText = styled.div`
  /* StatusText styling */
  font-size: var(--h3-font-size);
  font-weight: var(--font-weight-bold);
  color: var(--text-light);
`;

const DateTime = styled.div`
  /* DateTime styling */
  flex-basis: 25%;
  text-align: right;
  padding: var(--padding-size-base);
  color: var(--text-dark);
`;

const Date = styled.div`
  /* Date styling */
  font-size: var(--font-size-lg);
`;

const Time = styled.div`
  /* Time styling */
  font-size: var(--h3-font-size);
  font-weight: var(--font-weight-bold);
`;

const ButtonWrapper = styled.div`
/* ButtonWrapper styling */
  display: flex;
  column-gap: calc(var(--spacer) * 2);
`;

const Button = styled.button`
  /* Button styling */
  display: flex;
  column-gap: var(--spacer);
  font-size: var(--font-size-m);
  white-space: nowrap;
  align-items: center;
  padding: calc(var(--font-size-base) * 0.75) calc(var(--font-size-base) * 1.75);
  background-color: var(--color-green-600);
  border-color: var(--color-green-600);
  border-radius: var(--border-radius-md);
  border-style: solid;
  color: var(--text-light);
`;

const IconCalendarPlusWrapper = styled(IconCalendarPlus)`
  /* IconCalendarPlus styling */
  width: var(--font-size-xl);
  height: var(--font-size-xl);
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: calc(var(--padding-size-base) * 2);
`;

const ContentItem = styled.div`
  border-left: calc(var(--border-size) * 2) var(--border-style) var(--text-color) ;
  padding-left: var(--padding-size-base);
  margin-bottom: var(--margin-size-base);
  font-size: var(--font-size-base);

  &:first-of-type {
    font-size: calc(var(--font-size-base) * 2);
  }
`;

const Meta = styled.div`
  color: inherit;
  opacity: 0.75;
  font-size: smaller;
`;

CalendarSingleBooking.defaultProps = {
  templateClasses: [],
  templateRootStyle: {},
};

CalendarSingleBooking.propTypes = {
  templateClasses: PropTypes.arrayOf(PropTypes.string),
  templateRootStyle: PropTypes.shape({}),
  calendarEvents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string,
      startTime: PropTypes.number.isRequired,
      endTime: PropTypes.number,
      resourceTitle: PropTypes.string,
      resourceId: PropTypes.string,
    })
  ).isRequired,
  content: PropTypes.shape({
    title: PropTypes.string,
    subTitle: PropTypes.string,
    resourceAvailableText: PropTypes.string,
    resourceUnavailableText: PropTypes.string,
  }).isRequired,
  getTitle: PropTypes.func.isRequired,
};

export default CalendarSingleBooking;