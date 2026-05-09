import { renderToStaticMarkup } from 'react-dom/server';
import { renderEnText } from './renderEnText';

const render = (node: React.ReactNode) => renderToStaticMarkup(<>{node}</>);

describe('renderEnText – period/question mark splitting', () => {
  it('returns plain text when both options are disabled', () => {
    expect(renderEnText('First sentence. Second sentence.', false, false)).toBe('First sentence. Second sentence.');
  });

  it('splits after a period', () => {
    expect(render(renderEnText('First sentence. Second sentence.', false, true)))
      .toBe('First sentence.<br/>Second sentence.');
  });

  it('splits after a question mark', () => {
    expect(render(renderEnText('Is this right? Yes it is.', false, true)))
      .toBe('Is this right?<br/>Yes it is.');
  });

  it('splits after an exclamation mark', () => {
    expect(render(renderEnText('Amazing! What a sight.', false, true)))
      .toBe('Amazing!<br/>What a sight.');
  });

  it('does not add a trailing line break after the last sentence', () => {
    expect(render(renderEnText('First sentence. Second sentence.', false, true)))
      .not.toMatch(/<br\/>$/);
  });

  it('does not insert a line break when there is only one sentence', () => {
    expect(render(renderEnText('Only one sentence here.', false, true)))
      .not.toContain('<br/>');
  });
});

describe('renderEnText – dialogue splitting', () => {
  it('puts dialogue on its own line', () => {
    const html = render(renderEnText('He said "hello" to her.', true, false));
    expect(html).toContain('<br/>&quot;hello&quot;<br/>');
  });

  it('does not insert a line break when dialogue splitting is disabled', () => {
    expect(render(renderEnText('He said "hello" to her.', false, false)))
      .not.toContain('<br/>');
  });
});

describe('renderEnText – period and dialogue splitting combined', () => {
  it('applies both period and dialogue splits', () => {
    const html = render(renderEnText('He said "hello." She replied "hi."', true, true));
    expect(html).toContain('<br/>');
  });
});
