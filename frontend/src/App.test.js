import  React   from 'react';
import ReactDOM from 'react-dom';
import Login from './components/Login';
import PageNotFound from './components/PageNotFound'
import SignUp from './components/SignUp'
import File from './components/File'
import renderer from 'react-test-renderer';

it('renders login without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Login />, div);
});

it('renders signup without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SignUp />, div);
});

it('renders 404 without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PageNotFound />, div);
});


test('x displays when hovering file', () => {
  let file = {
    title: 'My Test File',
    updated_at: 0,
    created_at: 0,
  }
  const component = renderer.create(
    <File file={file}/>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // manually trigger the callback
  tree.props.onMouseOver();
  // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // manually trigger the callback
  tree.props.onMouseLeave();
  // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
